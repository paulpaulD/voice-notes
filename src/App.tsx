import React, { useState, useEffect, useCallback } from 'react';
import { Mic, MicOff, Copy, Trash2, Download } from 'lucide-react';

function App() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      
      recognition.onresult = (event) => {
        let currentTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      setRecognition(recognition);
    }
  }, []);

  const toggleListening = useCallback(() => {
    if (!recognition) return;

    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
    }
    setIsListening(!isListening);
  }, [isListening, recognition]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(transcript);
  };

  const clearTranscript = () => {
    setTranscript('');
  };

  const downloadTranscript = () => {
    const element = document.createElement('a');
    const file = new Blob([transcript], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'transcript.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Voice to Text Converter</h1>
            <p className="text-gray-600">Speak naturally, and watch your words appear on screen</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
            <div className="flex justify-center mb-6">
              <button
                onClick={toggleListening}
                className={`p-4 rounded-full transition-all duration-300 ${
                  isListening
                    ? 'bg-red-500 hover:bg-red-600'
                    : 'bg-blue-500 hover:bg-blue-600'
                }`}
              >
                {isListening ? (
                  <MicOff className="w-8 h-8 text-white" />
                ) : (
                  <Mic className="w-8 h-8 text-white" />
                )}
              </button>
            </div>

            <div className="relative">
              <textarea
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                className="w-full h-64 p-4 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your speech will appear here..."
              />
              
              <div className="absolute bottom-4 right-4 flex space-x-2">
                <button
                  onClick={copyToClipboard}
                  className="p-2 text-gray-600 hover:text-blue-500 transition-colors"
                  title="Copy to clipboard"
                >
                  <Copy className="w-5 h-5" />
                </button>
                <button
                  onClick={clearTranscript}
                  className="p-2 text-gray-600 hover:text-red-500 transition-colors"
                  title="Clear transcript"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                <button
                  onClick={downloadTranscript}
                  className="p-2 text-gray-600 hover:text-green-500 transition-colors"
                  title="Download transcript"
                >
                  <Download className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Instructions</h2>
            <ul className="space-y-2 text-gray-600">
              <li>1. Click the microphone button to start recording</li>
              <li>2. Speak clearly into your microphone</li>
              <li>3. Click the button again to stop recording</li>
              <li>4. Use the toolbar to copy, clear, or download your transcript</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;