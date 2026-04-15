const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { v4: uuidv4 } = require('uuid');

const executeCode = async (req, res) => {
  const { code } = req.body;

  if (!code || typeof code !== 'string') {
    return res.status(400).json({ status: 'error', message: 'Valid Python code string is required' });
  }

  // Security Filter: Expanded list of restricted keywords
  const dangerousKeywords = [
    'os.system', 'os.remove', 'os.rmdir', 'shutil.', 
    'subprocess.', 'eval(', 'exec(', 'open(', 
    '__import__', 'importlib', 'socket.', 'requests.'
  ];
  
  for (const word of dangerousKeywords) {
    if (code.includes(word)) {
      return res.status(403).json({ 
        status: 'error', 
        message: `Security Policy: The keyword '${word}' is restricted in this playground for safety.` 
      });
    }
  }

  // Create absolute path to a temp file
  const tempDir = os.tmpdir();
  const fileName = `playground_${uuidv4()}.py`;
  const filePath = path.join(tempDir, fileName);

  try {
    // Spawn Python process
    // On Linux systems (production / docker), it is usually python3.
    // On some Windows systems, it might be python.
    let pythonExecutable = 'python3';
    
    // Simple check to use 'python' on Windows if python3 might not be in path
    if (process.platform === 'win32') {
      pythonExecutable = 'python';
    }

    const pythonProcess = spawn(pythonExecutable, ['-I', filePath]);

    let stdout = '';
    let stderr = '';

    // Capture output
    pythonProcess.stdout.on('data', (data) => {
      stdout += data.toString();
      if (stdout.length > 5000) {
        pythonProcess.kill();
        stdout += '\n... [Output truncated due to size]';
      }
    });

    pythonProcess.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    // Timeout logic (3 seconds)
    const timeout = setTimeout(() => {
      pythonProcess.kill();
      stderr += '\nExecution timed out (Max 3s)';
    }, 3000);

    pythonProcess.on('close', (code) => {
      clearTimeout(timeout);
      
      // Cleanup: Delete the temp file
      try {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      } catch (e) {
        console.error('Failed to cleanup temp file:', e);
      }

      res.json({
        status: 'success',
        stdout: stdout,
        stderr: stderr,
        code: code
      });
    });

  } catch (error) {
    // Final cleanup if crash occurs before process close
    if (fs.existsSync(filePath)) {
      try { fs.unlinkSync(filePath); } catch (e) {}
    }
    console.error('Code execution system error:', error);
    res.status(500).json({ status: 'error', message: 'The local execution engine encountered a system error.' });
  }
};

module.exports = {
  executeCode
};
