using UnityEngine;
using UnityEngine.UI;

public class GameplayUI : MonoBehaviour
{
    [Header("HUD Display Components")]
    public Text coinsText;
    public Text distanceText;
    public Slider staminaSlider;
    public Image doubleCoinsBadge;

    [Header("Controls")]
    public Button leftButton;
    public Button rightButton;
    public Button hornButton;
    public Button boostButton; // Click or Hold boost

    private PlayerController player;
    private bool isBoostButtonPressed = false;

    void Start()
    {
        player = FindObjectOfType<PlayerController>();

        // Set up button listeners
        if (leftButton != null) leftButton.onClick.AddListener(OnLeftClick);
        if (rightButton != null) rightButton.onClick.AddListener(OnRightClick);
        if (hornButton != null) hornButton.onClick.AddListener(OnHornClick);

        // Boost is best handled by checking hold state
        // In Unity, this requires an EventTrigger for PointerDown/PointerUp,
        // but we'll provide standard methods that can be called by UI Event Triggers.
    }

    void Update()
    {
        if (player == null)
        {
            player = FindObjectOfType<PlayerController>();
            return;
        }

        // Update Distance HUD
        if (GameManager.Instance != null)
        {
            distanceText.text = GameManager.Instance.GetDistanceKM().ToString("F1") + " KM";
        }

        // Update Stamina Slider
        if (staminaSlider != null)
        {
            staminaSlider.value = player.stamina / player.maxStamina;
        }

        // Check double coins indicator
        if (doubleCoinsBadge != null)
        {
            doubleCoinsBadge.gameObject.SetActive(PlayerPrefs.GetInt("DoubleCoinsActive", 0) == 1);
        }

        // Handle Boost button held state
        if (isBoostButtonPressed)
        {
            player.ActivateBoost(true);
        }
    }

    public void UpdateCoinText(int coins)
    {
        if (coinsText != null)
        {
            coinsText.text = coins.ToString();
        }
    }

    private void OnLeftClick()
    {
        if (player != null) player.MoveLaneLeft();
    }

    private void OnRightClick()
    {
        if (player != null) player.MoveLaneRight();
    }

    private void OnHornClick()
    {
        if (player != null) player.BlowHorn();
    }

    // Call this from EventTrigger PointerDown on the Boost Button
    public void OnBoostPointerDown()
    {
        isBoostButtonPressed = true;
    }

    // Call this from EventTrigger PointerUp on the Boost Button
    public void OnBoostPointerUp()
    {
        isBoostButtonPressed = false;
        if (player != null) player.ActivateBoost(false);
    }
}
