using UnityEngine;
using UnityEngine.UI;
using System;

public class DailyRewardManager : MonoBehaviour
{
    [Header("Daily Reward settings")]
    public int dailyRewardAmount = 200;
    
    [Header("UI Components")]
    public Button claimButton;
    public Text rewardStatusText;
    public Text totalCoinsText;

    private string lastClaimKey = "LastDailyRewardClaimed";

    void Start()
    {
        if (claimButton != null)
        {
            claimButton.onClick.AddListener(ClaimReward);
        }
        CheckRewardStatus();
    }

    public void CheckRewardStatus()
    {
        if (CanClaimReward())
        {
            if (claimButton != null) claimButton.interactable = true;
            if (rewardStatusText != null) rewardStatusText.text = "Daily Reward Ready!";
        }
        else
        {
            if (claimButton != null) claimButton.interactable = false;
            
            // Calculate time left
            TimeSpan timeLeft = GetTimeUntilNextClaim();
            if (rewardStatusText != null)
            {
                rewardStatusText.text = $"Next claim in: {timeLeft.Hours:D2}h {timeLeft.Minutes:D2}m";
            }
        }

        UpdateCoinsText();
    }

    public bool CanClaimReward()
    {
        string lastClaimStr = PlayerPrefs.GetString(lastClaimKey, string.Empty);
        if (string.IsNullOrEmpty(lastClaimStr))
        {
            return true;
        }

        if (DateTime.TryParse(lastClaimStr, out DateTime lastClaimTime))
        {
            // Can claim if it's a new calendar day
            return DateTime.Today > lastClaimTime.Date;
        }

        return true;
    }

    public void ClaimReward()
    {
        if (CanClaimReward())
        {
            int totalCoins = PlayerPrefs.GetInt("TotalCoins", 0);
            totalCoins += dailyRewardAmount;
            PlayerPrefs.SetInt("TotalCoins", totalCoins);
            PlayerPrefs.SetString(lastClaimKey, DateTime.Now.ToString());
            PlayerPrefs.Save();

            // Sync with GameManager
            if (GameManager.Instance != null)
            {
                GameManager.Instance.totalCoins = totalCoins;
            }

            CheckRewardStatus();
            
            // Highlight coins on UIManager if visible
            UIManager ui = FindObjectOfType<UIManager>();
            if (ui != null) ui.UpdateMenuStats();
        }
    }

    private TimeSpan GetTimeUntilNextClaim()
    {
        string lastClaimStr = PlayerPrefs.GetString(lastClaimKey, string.Empty);
        if (DateTime.TryParse(lastClaimStr, out DateTime lastClaimTime))
        {
            DateTime nextClaimTime = lastClaimTime.Date.AddDays(1);
            TimeSpan diff = nextClaimTime - DateTime.Now;
            if (diff.Ticks < 0) return TimeSpan.Zero;
            return diff;
        }
        return TimeSpan.Zero;
    }

    private void UpdateCoinsText()
    {
        if (totalCoinsText != null)
        {
            totalCoinsText.text = PlayerPrefs.GetInt("TotalCoins", 0).ToString();
        }
    }
}
