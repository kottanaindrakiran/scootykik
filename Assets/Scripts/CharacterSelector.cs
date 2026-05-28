using UnityEngine;
using System.Collections.Generic;

public class CharacterSelector : MonoBehaviour
{
    [System.Serializable]
    public class CharacterData
    {
        public string characterName;
        public int coinCost;
        public bool isUnlockedByDefault;
        public float speedStat; // 1-10 scale
        public float controlStat; // 1-10 scale
        public float staminaStat; // 1-10 scale
        public string rankText;
        public GameObject characterModelPrefab;
        public string description;
    }

    public List<CharacterData> characters = new List<CharacterData>();
    private string selectedCharKey = "SelectedCharacter";

    void Awake()
    {
        // Populate default character list if empty in editor
        if (characters.Count == 0)
        {
            AddDefaultCharacters();
        }
    }

    private void AddDefaultCharacters()
    {
        characters.Add(new CharacterData { characterName = "Default Boy", coinCost = 0, isUnlockedByDefault = true, speedStat = 3f, controlStat = 4f, staminaStat = 4f, rankText = "1", description = "A simple high-school rider. Balanced stats." });
        characters.Add(new CharacterData { characterName = "Casual Boy", coinCost = 0, isUnlockedByDefault = true, speedStat = 4f, controlStat = 4f, staminaStat = 4f, rankText = "3", description = "Casual style, loves scooty riding." });
        characters.Add(new CharacterData { characterName = "Youngster", coinCost = 600, isUnlockedByDefault = false, speedStat = 4f, controlStat = 5f, staminaStat = 4f, rankText = "6", description = "Fast and furious city rider." });
        characters.Add(new CharacterData { characterName = "Punjabi Style", coinCost = 500, isUnlockedByDefault = false, speedStat = 5f, controlStat = 5f, staminaStat = 5f, rankText = "8", description = "Turban and black kurta. Full energy!" });
        characters.Add(new CharacterData { characterName = "Village Boy", coinCost = 800, isUnlockedByDefault = false, speedStat = 3f, controlStat = 6f, staminaStat = 7f, rankText = "10", description = "Dhoti and towel. Incredible stamina." });
        characters.Add(new CharacterData { characterName = "Farmer Boy", coinCost = 800, isUnlockedByDefault = false, speedStat = 3f, controlStat = 6f, staminaStat = 7f, rankText = "12", description = "Veshti and towel. Hardworking rider." });
        characters.Add(new CharacterData { characterName = "Street Style", coinCost = 1000, isUnlockedByDefault = false, speedStat = 6f, controlStat = 5f, staminaStat = 5f, rankText = "15", description = "Hoodie, street smarts. High speed." });
        characters.Add(new CharacterData { characterName = "Backpacker", coinCost = 1200, isUnlockedByDefault = false, speedStat = 5f, controlStat = 5f, staminaStat = 7f, rankText = "17", description = "Traveler, ready to ride across India." });
        characters.Add(new CharacterData { characterName = "Royal Look", coinCost = 1500, isUnlockedByDefault = false, speedStat = 6f, controlStat = 6f, staminaStat = 5f, rankText = "18", description = "Royal Kurta. Extremely premium style." });
        characters.Add(new CharacterData { characterName = "Royal Punjabi", coinCost = 2000, isUnlockedByDefault = false, speedStat = 6f, controlStat = 6f, staminaStat = 7f, rankText = "20", description = "Maroon turban. Absolute legend stats." });
    }

    public bool IsUnlocked(string charName)
    {
        CharacterData cd = GetCharacterData(charName);
        if (cd == null) return false;
        if (cd.isUnlockedByDefault) return true;

        return PlayerPrefs.GetInt("CharUnlocked_" + charName, 0) == 1;
    }

    public bool UnlockCharacter(string charName)
    {
        CharacterData cd = GetCharacterData(charName);
        if (cd == null) return false;

        int coins = PlayerPrefs.GetInt("TotalCoins", 0);
        if (coins >= cd.coinCost)
        {
            // Deduct coins
            PlayerPrefs.SetInt("TotalCoins", coins - cd.coinCost);
            // Unlock character
            PlayerPrefs.SetInt("CharUnlocked_" + charName, 1);
            PlayerPrefs.Save();
            
            // Sync GameManager coins if it exists
            if (GameManager.Instance != null)
            {
                GameManager.Instance.totalCoins = PlayerPrefs.GetInt("TotalCoins", 0);
            }
            return true;
        }
        return false;
    }

    public void SelectCharacter(string charName)
    {
        if (IsUnlocked(charName))
        {
            PlayerPrefs.SetString(selectedCharKey, charName);
            PlayerPrefs.Save();
        }
    }

    public string GetSelectedCharacter()
    {
        return PlayerPrefs.GetString(selectedCharKey, "Default Boy");
    }

    public CharacterData GetSelectedCharacterData()
    {
        return GetCharacterData(GetSelectedCharacter());
    }

    public CharacterData GetCharacterData(string charName)
    {
        return characters.Find(c => c.characterName == charName);
    }
}
