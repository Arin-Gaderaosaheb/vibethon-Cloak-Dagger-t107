const executeCode = async (req, res) => {
  const { code } = req.body;

  if (!code || typeof code !== 'string') {
    return res.status(400).json({ status: 'error', message: 'Valid Python code string is required' });
  }

  // Basic security sanity check before forwarding
  // Prevents very basic execution abuses, though Piston sandboxes it anyway
  const dangerousKeywords = ['os.system', 'subprocess', '__import__("os")', 'open(', 'eval(', 'exec('];
  for (const word of dangerousKeywords) {
    if (code.includes(word)) {
      return res.status(403).json({ 
        status: 'error', 
        message: 'Security Policy Violation: Certain sensitive modules and functions are disabled in this playground.' 
      });
    }
  }

  try {
    // Utilize Piston API (v2) for secure execution
    const executionResponse = await fetch('https://emkc.org/api/v2/piston/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        language: 'python',
        version: '3.10.0', // Standard piston python version
        files: [
          {
            name: 'main.py',
            content: code
          }
        ],
        compile_timeout: 5000,
        run_timeout: 3000, // Hard limit 3s execution
        compile_memory_limit: -1,
        run_memory_limit: 128 * 1024 * 1024 // 128MB
      })
    });

    if (!executionResponse.ok) {
      throw new Error('Piston execution engine failed to respond correctly');
    }

    const data = await executionResponse.json();
    
    // Parse the output structurally for the frontend
    res.json({
      status: 'success',
      output: data.run?.output || '',
      stdout: data.run?.stdout || '',
      stderr: data.run?.stderr || '',
      code: data.run?.code // 0 is success
    });

  } catch (error) {
    console.error('Code execution error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to execute code securely. Engine may be unavailable.' });
  }
};

module.exports = {
  executeCode
};
