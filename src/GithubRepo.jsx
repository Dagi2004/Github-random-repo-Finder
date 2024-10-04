import { useEffect, useState } from "react";
import axios from "axios";

const GithubRepo = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [language, setLanguage] = useState("");
  const [repo, setRepo] = useState(null);
  const [empty, setEmpty] = useState(false);

  const LanguageList = [
    { value: "JavaScript", label: "JavaScript" },
    { value: "React", label: "React" },
    { value: "Java", label: "Java" },
    { value: "CSS", label: "CSS" },
    { value: "Python", label: "Python" },
  ];

  const fetchRepo = async () => {
    if (!language) return;

    setEmpty(false);
    setError(false);
    setLoading(true);

    try {
      const response = await axios.get(
        `https://api.github.com/search/repositories?q=language:${language}&sort=stars`
      );
      const repos = response.data.items;
      console.log(repos);
      if (repos.length === 0) {
        setEmpty(true);
      } else {
        const randomRepo = repos[Math.floor(Math.random() * repos.length)];
        setRepo(randomRepo);
      }
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (language) {
      fetchRepo();
    }
  }, [language]);

  const refreshRepo = () => {
    fetchRepo();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-xl font-bold mb-4">GitHub Repository Finder</h1>
        <select
          className="w-full mb-4 p-2 border border-gray-300 rounded"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="">Select a Language</option>
          {LanguageList.map((lang) => (
            <option key={lang.value} value={lang.value}>
              {lang.label}
            </option>
          ))}
        </select>
        {loading && (
          <div className="bg-gray-200 p-4 rounded mb-4 text-center">
            Loading, please wait...
          </div>
        )}
        {error && (
          <div className="bg-red-200 p-4 rounded mb-4 text-center">
            Error fetching repositories
          </div>
        )}
        {empty && (
          <div className="bg-gray-200 p-4 rounded mb-4 text-center">
            No repositories found for this language.
          </div>
        )}
        {repo && !loading && (
          <div className="bg-white p-4 rounded-lg shadow mb-4">
            <h2 className="text-lg font-semibold">{repo.name}</h2>
            <p className="text-gray-700">{repo.description}</p>
            <div className="flex items-center text-gray-500 mt-2 spac">
              <span className="mr-2">{language}</span>
              <span className="mr-2">⭐ {repo.stargazers_count}</span>
              <span className="mr-2">🍴 {repo.forks_count}</span>
              <span>🐛 {repo.open_issues_count}</span>
            </div>
          </div>
        )}
        <button
          onClick={refreshRepo}
          className="w-full bg-blue-500 text-white px-4 py-2 rounded"
        >
          Refresh
        </button>
      </div>
    </div>
  );
};

export default GithubRepo;
