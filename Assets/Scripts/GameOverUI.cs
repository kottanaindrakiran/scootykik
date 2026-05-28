using UnityEngine;
using UnityEngine.UI;

public class GameOverUI : MonoBehaviour
{
    [Header("UI Score Elements")]
    public Text distanceText;
    public Text coinsText;
    public Text bestScoreText;
    public Text statusMessageText; // Funny messages (e.g. VVIP Convoy crash)

    [Header("Action Buttons")]
    public Button shareButton;
    public Button reviveButton;
    public Button homeButton;

    private UIManager uiManager;
    private bool hasRevivedThisGame = false;

    void Start()
    {
        uiManager = FindObjectOfType<UIManager>();

        if (shareButton != null) shareButton.onClick.AddListener(OnShareClick);
        if (reviveButton != null) reviveButton.onClick.AddListener(OnReviveClick);
        if (homeButton != null) homeButton.onClick.AddListener(OnHomeClick);
    }

    public void ShowGameOverScreen(float distance, int coins, float highScore, bool instantGameOver)
    {
        gameObject.SetActive(true);

        if (distanceText != null) distanceText.text = distance.ToString("F2") + " KM";
        if (coinsText != null) coinsText.text = coins.ToString();
        if (bestScoreText != null) bestScoreText.text = highScore.ToString("F2") + " KM";

        if (statusMessageText != null)
        {
            if (instantGameOver)
            {
                statusMessageText.text = "CRITICAL FAILURE! You hit a VVIP Convoy! VIPs don't wait!";
            }
            else
            {
                statusMessageText.text = GetRandomFunnyDeathMessage();
            }
        }

        // Configure Revive Button
        // Disable revive if player already revived once, or if hit by VVIP Convoy (instant game over)
        if (reviveButton != null)
        {
            reviveButton.gameObject.SetActive(!hasRevivedThisGame && !instantGameOver);
        }
    }

    public void HideGameOverScreen()
    {
        gameObject.SetActive(false);
    }

    private string GetRandomFunnyDeathMessage()
    {
        string[] messages = {
            "Ouch! Pothole or crater? Welcome to Indian Roads!",
            "Did that cow just judge your driving skills?",
            "Auto rickshaw cut you off? Typical Tuesday!",
            "Indian speed breakers: testing suspensions since 1947.",
            "Crash! Horn please next time!",
            "You ran right into the wedding procession! Did you get any biryani?"
        };
        return messages[Random.Range(0, messages.Length)];
    }

    private void OnReviveClick()
    {
        // Trigger AdMob Rewarded Ad
        AdMobManager ads = FindObjectOfType<AdMobManager>();
        if (ads != null)
        {
            ads.ShowRewardedAd((bool success) => {
                if (success)
                {
                    hasRevivedThisGame = true;
                    if (GameManager.Instance != null)
                    {
                        GameManager.Instance.RevivePlayer();
                    }
                }
            });
        }
        else
        {
            // Fail safe in editor if AdMob is missing
            hasRevivedThisGame = true;
            if (GameManager.Instance != null)
            {
                GameManager.Instance.RevivePlayer();
            }
        }
    }

    private void OnShareClick()
    {
        WhatsAppShare share = FindObjectOfType<WhatsAppShare>();
        if (share != null)
        {
            share.ShareScoreCard();
        }
    }

    private void OnHomeClick()
    {
        hasRevivedThisGame = false;
        HideGameOverScreen();
        if (uiManager != null)
        {
            uiManager.OnBackToMainMenuClick();
        }
    }
}
