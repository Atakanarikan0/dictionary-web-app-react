import { useEffect, useState } from "react"

function App() {
  const [word, setWord] = useState(null);
  const [searchWord, setSearchWord] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [fontFamily, setFontFamily] = useState("Inter");



  useEffect(() => {
    async function getWord() {
      if (!searchWord) return;
      try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${searchWord}`);
        if (response.ok) {
          const data = await response.json();
          setWord(data);
        } else {
          setWord(null);
        }
      } catch (error) {
        console.error("Error fetching word:", error);
        setWord(null);
      }
    }
    getWord()
  }, [searchWord])

  function handleClick() {
    setDarkMode(!darkMode);
  }
  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
  }, [darkMode]);


  function handleFontChange(e) {
    setFontFamily(e.target.value);
  }

  return (
    <div className="container" style={{ fontFamily }}>
      <header>
        <select value={fontFamily} onChange={handleFontChange}>
          <option value="Inter">Sans Serif</option>
          <option value="Lora">Serif</option>
          <option value="Inconsolata">Mono</option>
        </select>
        <label onClick={handleClick}>
          <input type="checkbox" className="switch"/>
        </label>
      </header>
      <div className="form-section">
        <SearchWord setSearchWord={setSearchWord} searchWord={searchWord} word={word}/>
      </div>
    </div>
  )
}

function SearchWord({ setSearchWord , word, searchWord }) {
  function handleSubmit(e) {
    e.preventDefault()
    const input = e.target.searchInput.value
    setSearchWord(input)
  }

  function playAudio() {
    const audioUrl = word[0]?.phonetics.find((item) => item.audio)?.audio;

    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play();
    } else {
      alert("Ses dosyası bulunamadı!");
    }
  }
  return (
    <>
      <form onSubmit={handleSubmit}>
        <input type="text" required className="searchInput" name="searchInput" autoComplete="off"/>
        <button>
        </button>
      </form>
      {word && (
        <div className="dictionary-container">
          <div className="word-header">
            <h1 className="word">{word[0]?.word}</h1>
            <p className="phonetic">{word[0]?.phonetic}</p>
            <button className="play-audio" onClick={playAudio}>
            </button>
          </div>
          <div className="word-type noun">
            <h2 className="type-title">{word[0]?.meanings[0]?.partOfSpeech}</h2>
            <hr />
          </div>
          <div className="meaning">
              <h3 className="section-title">Meaning</h3>
              <ul className="meaning-list">
                {word[0]?.meanings[0]?.definitions.map((x, index) => 
                <>
                  <li key={index}>{x.definition}</li>
                  {x.example && <span>"{x.example}"</span>}
                </>)}
              </ul>
          </div>
          <div className="synonyms">
             {word[0]?.meanings[0]?.synonyms.length > 0 && (
              <>
               <h5>Synonyms</h5>
               <p>{word[0]?.meanings[0]?.synonyms.join(", ")}</p>
               </>)}
          </div>
          <div className="word-type verb">
            <h2 className="type-title">{word[0]?.meanings[1]?.partOfSpeech}</h2>
            <hr />
          </div>
          <div className="meaning">
              <h3 className="section-title">Meaning</h3>
              <ul className="meaning-list">
              {word[0]?.meanings[1]?.definitions.map((x, index) => 
              <>
                <li key={index}>{x.definition}</li>
                {x.example && <span>"{x.example}"</span>}
              </>
              )}
              </ul>
          </div>
          <div className="synonyms">
             {word[0]?.meanings[1]?.synonyms.length > 0 && (
              <>
               <h5>Synonyms</h5>
               <p>{word[0]?.meanings[1]?.synonyms.join(", ")}</p>
               </>)}
          </div>
          <hr />
          <div className="source">
            <h3>Source</h3>
            <p><a href={word[0]?.sourceUrls}>{word[0]?.sourceUrls}</a></p>
          </div>

        </div>
      )}
      {searchWord && word === null &&
      (
        <div className="error-message">
          <span className="emoji">🫤</span>
          <h4>No Definitions Found</h4>
          <p>Sorry pal, we couldn't find definitions for the word you were looking for. You can try the search again at later time or head to the web instead.</p>
        </div>
      )}

    </>

  ) 
}

export default App
