using UnityEngine;
using System.Collections.Generic;

public class VehicleSelector : MonoBehaviour
{
    [System.Serializable]
    public class VehicleData
    {
        public string vehicleName;
        public int coinCost;
        public bool isUnlockedByDefault;
        public float speedStat; // 1-10 scale
        public float controlStat; // 1-10 scale
        public float staminaStat; // 1-10 scale
        public GameObject vehicleModelPrefab;
        public string uniqueSoundId;
        public string description;
    }

    public List<VehicleData> vehicles = new List<VehicleData>();
    private string selectedVehicleKey = "SelectedVehicle";

    void Awake()
    {
        if (vehicles.Count == 0)
        {
            AddDefaultVehicles();
        }
    }

    private void AddDefaultVehicles()
    {
        vehicles.Add(new VehicleData {
            vehicleName = "Scooty",
            coinCost = 0,
            isUnlockedByDefault = true,
            speedStat = 5f,
            controlStat = 6f,
            staminaStat = 6f,
            uniqueSoundId = "scooty_engine",
            description = "Your trusty Indian gearless scooter. Balanced stats, stable handling."
        });

        vehicles.Add(new VehicleData {
            vehicleName = "Cycle",
            coinCost = 400,
            isUnlockedByDefault = false,
            speedStat = 2f,
            controlStat = 8f,
            staminaStat = 9f,
            uniqueSoundId = "bicycle_bell",
            description = "Simple eco-friendly ride. High control, great stamina, but slow speed."
        });

        vehicles.Add(new VehicleData {
            vehicleName = "Bike",
            coinCost = 800,
            isUnlockedByDefault = false,
            speedStat = 7f,
            controlStat = 4f,
            staminaStat = 5f,
            uniqueSoundId = "motorcycle_engine",
            description = "A standard 150cc commuter bike. Fast acceleration but harder to steer."
        });

        vehicles.Add(new VehicleData {
            vehicleName = "Auto Rickshaw",
            coinCost = 1200,
            isUnlockedByDefault = false,
            speedStat = 3f,
            controlStat = 6f,
            staminaStat = 4f,
            uniqueSoundId = "auto_tuk_tuk",
            description = "The classic yellow/green three-wheeler. High control, wide, and makes funny noises."
        });

        vehicles.Add(new VehicleData {
            vehicleName = "Race Car",
            coinCost = 2000,
            isUnlockedByDefault = false,
            speedStat = 9f,
            controlStat = 3f,
            staminaStat = 7f,
            uniqueSoundId = "sports_car_rev",
            description = "A modified street racer. Maximum speed but extremely touchy controls."
        });
    }

    public bool IsUnlocked(string vehicleName)
    {
        VehicleData vd = GetVehicleData(vehicleName);
        if (vd == null) return false;
        if (vd.isUnlockedByDefault) return true;

        return PlayerPrefs.GetInt("VehicleUnlocked_" + vehicleName, 0) == 1;
    }

    public bool UnlockVehicle(string vehicleName)
    {
        VehicleData vd = GetVehicleData(vehicleName);
        if (vd == null) return false;

        int totalCoins = PlayerPrefs.GetInt("TotalCoins", 0);
        if (totalCoins >= vd.coinCost)
        {
            PlayerPrefs.SetInt("TotalCoins", totalCoins - vd.coinCost);
            PlayerPrefs.SetInt("VehicleUnlocked_" + vehicleName, 1);
            PlayerPrefs.Save();

            if (GameManager.Instance != null)
            {
                GameManager.Instance.totalCoins = PlayerPrefs.GetInt("TotalCoins", 0);
            }
            return true;
        }
        return false;
    }

    public void SelectVehicle(string vehicleName)
    {
        if (IsUnlocked(vehicleName))
        {
            PlayerPrefs.SetString(selectedVehicleKey, vehicleName);
            PlayerPrefs.Save();
        }
    }

    public string GetSelectedVehicle()
    {
        return PlayerPrefs.GetString(selectedVehicleKey, "Scooty");
    }

    public VehicleData GetSelectedVehicleData()
    {
        return GetVehicleData(GetSelectedVehicle());
    }

    public VehicleData GetVehicleData(string vehicleName)
    {
        return vehicles.Find(v => v.vehicleName == vehicleName);
    }
}
