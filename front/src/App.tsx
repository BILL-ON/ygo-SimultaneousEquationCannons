import React, { useState, useEffect } from "react";
import "./App.css";


function App() {
  const [colorScheme, setColorScheme] = useState<string>("light");
  const [totalCards, setTotalCards] = useState<number>(0);
  const [opponentMonstersRankOrLevel, setOpponentMonstersRankOrLevel] = useState<(number | null)[]>(new Array(5).fill(null));
  const [selectedFusionLevels, setSelectedFusionLevels] = useState<number[]>([]);
  const [selectedXyzRanks, setSelectedXyzRanks] = useState<number[]>([]);
  const [calculationResult, setCalculationResult] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isToggleOn, setIsToggleOn] = useState<boolean>(false);

  const levels = Array.from({ length: 12 }, (_, i) => i + 1);
  const MAX_EXTRA_DECK_SIZE = 15;

  const calculateExtraDeckCount = () => {
    return selectedFusionLevels.length + selectedXyzRanks.length * 2;
  }

  const solveCardRequirements = (totalCards: number, opponentMonsterRankOrLevel: number | null) => {
    if (opponentMonsterRankOrLevel == null) {
      return null;
    }
    const R = totalCards - opponentMonsterRankOrLevel;
    const L = 2 * opponentMonsterRankOrLevel - totalCards;

    if (R > 0 && L > 0) {
      return {
        fusionLevel: L,
        xyzRank1: R,
        xyzRank2: R,
      };
    } else {
      return null;
    }
  };

  const showErrorMessage = (message: string) => {
    setErrorMessage(message);

    setTimeout(() => {
      setErrorMessage("");
    }, 3000);
  };

  const handleFusionLevelToggle = (level: number) => {
    if (selectedFusionLevels.includes(level)) {
      setSelectedFusionLevels((prev) => prev.filter((l) => l !== level));
    } else {
      if (calculateExtraDeckCount() < MAX_EXTRA_DECK_SIZE) {
        setSelectedFusionLevels((prev) => [...prev, level]);
      } else {
        showErrorMessage("Extra Deck limit exceeded! Maximum 15 cards allowed.");
      }
    }
  };

  const handleXyzRankToggle = (rank: number) => {
    if (selectedXyzRanks.includes(rank)) {
      setSelectedXyzRanks((prev) => prev.filter((r) => r !== rank));
    } else {
      if (calculateExtraDeckCount() + 2 <= MAX_EXTRA_DECK_SIZE) {
        setSelectedXyzRanks((prev) => [...prev, rank]);
      } else {
        showErrorMessage("Extra Deck limit exceeded! Maximum 15 cards allowed.");
      }
    }
  };

  const generatePossibleCards = (opponentMonstersRankOrLevel: (number | null)[]) => {
    const possibleCards = [];
    for (const opponentMonsterRankOrLevel of opponentMonstersRankOrLevel) {
      if (opponentMonsterRankOrLevel !== null) {
        for (let total = 1; total <= 30; total++) {
          const result = solveCardRequirements(total, opponentMonsterRankOrLevel);
          if (
            result &&
            selectedFusionLevels.includes(result.fusionLevel) &&
            selectedXyzRanks.includes(result.xyzRank1)
          ) {
            possibleCards.push({ total, ...result });
          }
        }
      }
    }
    return possibleCards;
  };

  useEffect(() => {
    const result = [];
    for (const opponentMonsterRankOrLevel of opponentMonstersRankOrLevel) {
      if (opponentMonsterRankOrLevel !== null) {
        const data = solveCardRequirements(totalCards, opponentMonsterRankOrLevel);
        if (data !== null) {
          result.push(data);
        }
      }
    }
    if (result.length > 0) {
      setCalculationResult(result);
    }

  }, [totalCards, opponentMonstersRankOrLevel, selectedFusionLevels, selectedXyzRanks]);

  useEffect(() => {
    const darkThemeQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleThemeChange = (event: MediaQueryListEvent) => {
      const newTheme = event.matches ? "dark" : "light";
      setColorScheme(newTheme);
      document.body.setAttribute('data-theme', newTheme);
    };

    // Set initial theme
    const initialTheme = darkThemeQuery.matches ? "dark" : "light";
    setColorScheme(initialTheme);
    document.body.setAttribute('data-theme', initialTheme);

    darkThemeQuery.addEventListener("change", handleThemeChange);

    return () => {
      darkThemeQuery.removeEventListener("change", handleThemeChange);
    };
  }, []);

  return (
    <div className="app">
      <h1 className="title">Simultaneous Equation Cannons Calculator</h1>

      <h2 className="section-title">Extra Deck</h2>
      <div className="selection-section">
        <div className="selection-group-box">
          <div className="selection-group">
            <h3>Select Fusion Levels:</h3>
            <div className="level-buttons">
              {levels.map((level) => (
                <button
                  key={`fusion-${level}`}
                  className={selectedFusionLevels.includes(level) ? "selected" : ""}
                  onClick={() => handleFusionLevelToggle(level)}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div className="selection-group">
            <h3>Select Xyz Ranks:</h3>
            <div className="level-buttons">
              {levels.map((rank) => (
                <button
                  key={`xyz-${rank}`}
                  className={selectedXyzRanks.includes(rank) ? "selected" : ""}
                  onClick={() => handleXyzRankToggle(rank)}
                >
                  {rank}
                </button>
              ))}
            </div>
          </div>

          <div className="deck-count">
            <p>
              <strong>Total Cards in Extra Deck:</strong> {calculateExtraDeckCount()} / 15
            </p>
          </div>

          <div className="error-message-container">
            {errorMessage && <p className="error-message">{errorMessage}</p>}
          </div>

          <button
            className="clear-button"
            onClick={() => {
              setSelectedFusionLevels([]);
              setSelectedXyzRanks([]);
              setErrorMessage("");
            }}
          >
            Clear Selections
          </button>
        </div>
      </div>

      <h2 className="section-title">Board State</h2>
      <div className="input-section">
        <div className="input-group">
          <label>Total Cards:</label>
          <input
            type="number"
            value={totalCards}
            onChange={(e) => {
              const value = Math.max(0, Number(e.target.value));
              setTotalCards(value);
            }}
            disabled={isToggleOn}
          />
          <div className="button-group">
            <button onClick={() => setTotalCards((prev) => Math.max(0, prev - 1))} disabled={isToggleOn}>-</button>
            <button onClick={() => setTotalCards((prev) => prev + 1)} disabled={isToggleOn}>+</button>
          </div>
          <div className="button-group">
            <button onClick={() => setIsToggleOn((prev) => !prev)} className="toggle-possible-cards">
              {isToggleOn ? "On" : "Off"}
            </button>
          </div>
        </div>

        {opponentMonstersRankOrLevel.map((value, index) => (
          <div className="input-group" key={index}>
            <label>Opponent Monster Rank/Level:</label>
            <input
              type="number"
              value={value !== null ? value.toString() : ""}
              onChange={(e) => {
                setOpponentMonstersRankOrLevel((prev) => {
                  const updatedNumbers = [...prev];
                  updatedNumbers[index] = e.target.value === "" ? null : Math.min(12, Math.max(0, Number(e.target.value)));
                  return updatedNumbers;
                });
              }}
            />
            <div className="button-group">
              <button
                onClick={() =>
                  setOpponentMonstersRankOrLevel((prev) => {
                    const updatedNumbers = [...prev];
                    if (updatedNumbers[index] !== null) {
                      updatedNumbers[index] = Math.max(0, updatedNumbers[index] - 1);
                    }
                    return updatedNumbers;
                  })
                }
              >
                -
              </button>
              <button
                onClick={() =>
                  setOpponentMonstersRankOrLevel((prev) => {
                    const updatedNumbers = [...prev];
                    if (updatedNumbers[index] !== null) {
                      updatedNumbers[index] = Math.min(12, updatedNumbers[index] + 1);
                    } else {
                      updatedNumbers[index] = 1;
                    }
                    return updatedNumbers;
                  })
                }
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="result-section">
        {isToggleOn ? (
          <div className="result">
            <h3>Possible Cards:</h3>
            <table>
              <thead>
                <tr>
                  <th>Total Cards</th>
                  <th>Xyz Rank 1</th>
                  <th>Xyz Rank 2</th>
                  <th>Fusion Level</th>
                </tr>
              </thead>
              <tbody>
                {generatePossibleCards(opponentMonstersRankOrLevel).map((card, index) => (
                  <tr key={index}>
                    <td>{card.total}</td>
                    <td>{card.xyzRank1}</td>
                    <td>{card.xyzRank2}</td>
                    <td>{card.fusionLevel}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : calculationResult ? (
          <div className="result">
            <h3>Combination:</h3>
            <p><strong>Xyz Rank 1:</strong> {calculationResult.xyzRank1}</p>
            <p><strong>Xyz Rank 2:</strong> {calculationResult.xyzRank2}</p>
            <p><strong>Fusion Level:</strong> {calculationResult.fusionLevel}</p>
          </div>
        ) : selectedFusionLevels.length === 0 || selectedXyzRanks.length === 0 ? (
          <p className="no-selection">Please select at least one Fusion Level and one XYZ Rank.</p>
        ) : (
          <p className="no-result">No valid solution found with the selected parameters.</p>
        )}
      </div>
    </div>
  );
}

export default App;