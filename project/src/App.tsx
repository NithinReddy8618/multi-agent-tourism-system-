import { useState } from 'react';
import { MapPin, Send, Loader2 } from 'lucide-react';
import { TourismAgent } from './agents/tourismAgent';

function App() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const tourismAgent = new TourismAgent();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim()) return;

    setLoading(true);
    setError('');
    setResult('');

    try {
      const response = await tourismAgent.execute(input);

      if (response.success) {
        setResult(response.message);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError('An error occurred while processing your request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <MapPin className="w-12 h-12 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Tourism Planning Assistant</h1>
          <p className="text-gray-600">Get weather information and discover tourist attractions</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-2">
                Where are you planning to go?
              </label>
              <textarea
                id="destination"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="E.g., I'm going to go to Bangalore, let's plan my trip"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={3}
              />
            </div>
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Plan My Trip
                </>
              )}
            </button>
          </form>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
            <h3 className="text-red-800 font-semibold mb-2">Error</h3>
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {result && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Travel Information</h3>
            <div className="text-gray-700 whitespace-pre-line leading-relaxed">
              {result}
            </div>
          </div>
        )}

        <div className="mt-12 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Example Queries</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p className="cursor-pointer hover:text-blue-600" onClick={() => setInput("I'm going to go to Bangalore, let's plan my trip.")}>
              • I'm going to go to Bangalore, let's plan my trip.
            </p>
            <p className="cursor-pointer hover:text-blue-600" onClick={() => setInput("I'm going to go to Paris, what is the temperature there?")}>
              • I'm going to go to Paris, what is the temperature there?
            </p>
            <p className="cursor-pointer hover:text-blue-600" onClick={() => setInput("I'm going to go to Tokyo, what is the temperature there? And what are the places I can visit?")}>
              • I'm going to go to Tokyo, what is the temperature there? And what are the places I can visit?
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
