using UnityEngine;
using UnityEngine.UI;
using System.Collections.Generic;

public class UIManager : MonoBehaviour
{
    [Header("UI Panels")]
    public GameObject mainMenuPanel;
    public GameObject characterSelectPanel;
    public GameObject vehicleSelectPanel;
    public GameObject citySelectPanel;
    public GameObject hudPanel;
    public GameObject gameOverPanel;
    public GameObject shopPanel;

    [Header("Main Menu Details")]
    public Text menuTotalCoinsText;
    public Text menuHighScoreText;

    private List<GameObject> allPanels = new List<GameObject>();

    void Start()
    {
        // Add all panels to lists for easy management
        if (mainMenuPanel != null) allPanels.Add(mainMenuPanel);
        if (characterSelectPanel != null) allPanels.Add(characterSelectPanel);
        if (vehicleSelectPanel != null) allPanels.Add(vehicleSelectPanel);
        if (citySelectPanel != null) allPanels.Add(citySelectPanel);
        if (hudPanel != null) allPanels.Add(hudPanel);
        if (gameOverPanel != null) allPanels.Add(gameOverPanel);
        if (shopPanel != null) allPanels.Add(shopPanel);

        // Show Main Menu by default
        ShowPanel(mainMenuPanel);
        UpdateMenuStats();
    }

    public void ShowPanel(GameObject targetPanel)
    {
        foreach (var panel in allPanels)
        {
            if (panel != null)
            {
                panel.SetActive(panel == targetPanel);
            }
        }
    }

    public void UpdateMenuStats()
    {
        if (menuTotalCoinsText != null)
        {
            menuTotalCoinsText.text = PlayerPrefs.GetInt("TotalCoins", 0).ToString();
        }
        if (menuHighScoreText != null)
        {
            menuHighScoreText.text = PlayerPrefs.GetFloat("HighScore", 0f).ToString("F2") + " KM";
        }
    }

    // Main Menu Button Handlers
    public void OnPlayButtonClick()
    {
        ShowPanel(hudPanel);
        if (GameManager.Instance != null)
        {
            GameManager.Instance.StartGame();
        }
    }

    public void OnCharacterSelectButtonClick()
    {
        ShowPanel(characterSelectPanel);
    }

    public void OnVehicleSelectButtonClick()
    {
        ShowPanel(vehicleSelectPanel);
    }

    public void OnCitySelectButtonClick()
    {
        ShowPanel(citySelectPanel);
    }

    public void OnShopButtonClick()
    {
        ShowPanel(shopPanel);
    }

    public void OnBackToMainMenuClick()
    {
        ShowPanel(mainMenuPanel);
        UpdateMenuStats();
    }
}
