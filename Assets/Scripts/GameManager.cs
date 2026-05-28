using UnityEngine;
using System;

public class GameManager : MonoBehaviour
{
    public static GameManager Instance { get; private set; }

    [Header("Game State")]
    public static bool isPaused = false;
    public static bool isGameOver = false;
    public static bool isPlaying = false;

    [Header("Gameplay Variables")]
    public float distanceTraveled = 0f; // Tracked in meters, divided by 1000 for KM
    public int coinsCollectedThisRun = 0;
    public int totalCoins = 0;
    public float highScore = 0f;

    [Header("Ad Buffs & Boosts")]
    private bool isDoubleCoinsActive = false;
    private DateTime doubleCoinsEndTime;

    // References to UI
    private GameplayUI gameplayUI;
    private GameOverUI gameOverUI;
    private PlayerController player;

    void Awake()
    {
        if (Instance == null)
        {
            Instance = this;
            DontDestroyOnLoad(gameObject);
        }
        else
        {
            Destroy(gameObject);
        }
    }

    void Start()
    {
        LoadPlayerData();
        FindReferences();
    }

    void Update()
    {
        if (!isPlaying || isPaused || isGameOver) return;

        // Update distance based on player speed
        if (player != null)
        {
            distanceTraveled += player.currentSpeed * Time.deltaTime;
        }

        // Update double coin state
        if (isDoubleCoinsActive)
        {
            if (DateTime.Now >= doubleCoinsEndTime)
            {
                isDoubleCoinsActive = false;
                PlayerPrefs.SetInt("DoubleCoinsActive", 0);
            }
        }
    }

    public void FindReferences()
    {
        gameplayUI = FindObjectOfType<GameplayUI>();
        gameOverUI = FindObjectOfType<GameOverUI>();
        player = FindObjectOfType<PlayerController>();
    }

    public void StartGame()
    {
        isPlaying = true;
        isPaused = false;
        isGameOver = false;
        distanceTraveled = 0f;
        coinsCollectedThisRun = 0;

        // Trigger scene reload or player reset
        if (player == null)
        {
            player = FindObjectOfType<PlayerController>();
        }
        if (player != null)
        {
            player.Revive();
        }

        FindReferences();
    }

    public void PauseGame(bool pause)
    {
        isPaused = pause;
        Time.timeScale = pause ? 0f : 1f;
    }

    public void AddCoin()
    {
        int countToAdd = 1;
        if (isDoubleCoinsActive || PlayerPrefs.GetInt("DoubleCoinsActive", 0) == 1)
        {
            countToAdd = 2;
        }

        coinsCollectedThisRun += countToAdd;
        totalCoins += countToAdd;
        
        // Save dynamically
        PlayerPrefs.SetInt("TotalCoins", totalCoins);
        PlayerPrefs.Save();

        if (gameplayUI != null)
        {
            gameplayUI.UpdateCoinText(coinsCollectedThisRun);
        }
    }

    public void GameOver(bool instantGameOver = false)
    {
        isGameOver = true;
        isPlaying = false;

        // Check and save High Score (Distance in KM)
        float currentKM = GetDistanceKM();
        if (currentKM > highScore)
        {
            highScore = currentKM;
            PlayerPrefs.SetFloat("HighScore", highScore);
        }
        PlayerPrefs.Save();

        // Show Game Over UI
        if (gameOverUI != null)
        {
            gameOverUI.ShowGameOverScreen(currentKM, coinsCollectedThisRun, highScore, instantGameOver);
        }

        // Trigger Interstitial Ad via AdMobManager
        AdMobManager ads = FindObjectOfType<AdMobManager>();
        if (ads != null)
        {
            ads.ShowInterstitialAd();
        }
    }

    public void RevivePlayer()
    {
        isGameOver = false;
        isPlaying = true;
        
        if (player != null)
        {
            player.Revive();
        }

        if (gameOverUI != null)
        {
            gameOverUI.HideGameOverScreen();
        }
    }

    public void ActivateDoubleCoins(int minutes)
    {
        isDoubleCoinsActive = true;
        doubleCoinsEndTime = DateTime.Now.AddMinutes(minutes);
        PlayerPrefs.SetInt("DoubleCoinsActive", 1);
        PlayerPrefs.SetString("DoubleCoinsEndTime", doubleCoinsEndTime.ToString());
        PlayerPrefs.Save();
    }

    public float GetDistanceKM()
    {
        // 1 KM = 1000 Meters in game units
        return (float)Math.Round(distanceTraveled / 1000f, 2);
    }

    private void LoadPlayerData()
    {
        totalCoins = PlayerPrefs.GetInt("TotalCoins", 0);
        highScore = PlayerPrefs.GetFloat("HighScore", 0f);

        // Check if double coins active status was saved
        if (PlayerPrefs.GetInt("DoubleCoinsActive", 0) == 1)
        {
            string endTimeStr = PlayerPrefs.GetString("DoubleCoinsEndTime", string.Empty);
            if (!string.IsNullOrEmpty(endTimeStr))
            {
                if (DateTime.TryParse(endTimeStr, out DateTime savedEndTime))
                {
                    if (DateTime.Now < savedEndTime)
                    {
                        isDoubleCoinsActive = true;
                        doubleCoinsEndTime = savedEndTime;
                    }
                    else
                    {
                        PlayerPrefs.SetInt("DoubleCoinsActive", 0);
                    }
                }
            }
        }
    }

    public void AddCoins(int amount)
    {
        totalCoins += amount;
        PlayerPrefs.SetInt("TotalCoins", totalCoins);
        PlayerPrefs.Save();
    }
}
