using UnityEngine;
using System.Collections.Generic;

public class RoadGenerator : MonoBehaviour
{
    [System.Serializable]
    public struct CityTheme
    {
        public string themeName;
        public GameObject[] roadPrefabs; // Road segments for this specific theme
        public GameObject[] sideObstacles; // Buildings, trees, temples, etc.
        public Material roadMaterial;
        public string licensePlateFormat; // e.g. "TN 09", "KA 05", "AP 39" etc
    }

    [Header("Themes Setup")]
    public List<CityTheme> themes;
    public int currentThemeIndex = 0;

    [Header("Generation Settings")]
    public Transform playerTransform;
    public float segmentLength = 30f;
    public int numberOfSegmentsOnScreen = 6;
    public float safeZone = 40f;

    private List<GameObject> activeSegments = new List<GameObject>();
    private float spawnZ = 0f;

    void Start()
    {
        if (playerTransform == null)
        {
            GameObject player = GameObject.FindGameObjectWithTag("Player");
            if (player != null) playerTransform = player.transform;
        }

        // Set theme from selected city in PlayerPrefs
        LoadThemeFromPrefs();

        // Spawn initial batch of segments
        for (int i = 0; i < numberOfSegmentsOnScreen; i++)
        {
            // Spawn the first few segments without obstacles to give the player a safe start
            SpawnSegment(i == 0 || i == 1);
        }
    }

    void Update()
    {
        if (playerTransform == null) return;

        // Check if we need to spawn a new segment and delete the oldest one
        if (playerTransform.position.z - safeZone > (spawnZ - numberOfSegmentsOnScreen * segmentLength))
        {
            SpawnSegment(false);
            DeleteSegment();
        }
    }

    private void SpawnSegment(bool isEmptyStart)
    {
        CityTheme currentTheme = themes[currentThemeIndex];
        
        // Pick a road prefab
        GameObject roadPrefab = currentTheme.roadPrefabs[Random.Range(0, currentTheme.roadPrefabs.Length)];
        
        // Instantiate road segment
        GameObject go = Instantiate(roadPrefab, transform.forward * spawnZ, Quaternion.identity, transform);
        activeSegments.Add(go);

        // Apply theme-specific road material if defined
        if (currentTheme.roadMaterial != null)
        {
            Renderer renderer = go.GetComponentInChildren<Renderer>();
            if (renderer != null)
            {
                renderer.material = currentTheme.roadMaterial;
            }
        }

        // Spawn side obstacles (decorations, signboards, background buildings)
        if (!isEmptyStart && currentTheme.sideObstacles != null && currentTheme.sideObstacles.Length > 0)
        {
            SpawnSideProps(go.transform, currentTheme);
        }

        // Spawn actual road obstacles (cows, speed breakers, autos, potholes, etc.)
        if (!isEmptyStart)
        {
            ObstacleSpawner spawner = FindObjectOfType<ObstacleSpawner>();
            if (spawner != null)
            {
                spawner.SpawnObstaclesOnSegment(spawnZ, segmentLength);
            }
        }

        spawnZ += segmentLength;
    }

    private void DeleteSegment()
    {
        Destroy(activeSegments[0]);
        activeSegments.RemoveAt(0);
    }

    private void SpawnSideProps(Transform parentSegment, CityTheme theme)
    {
        // Spawn props on left and right side of the road segment
        float leftX = -5f;
        float rightX = 5f;

        // Left Side prop
        if (Random.value > 0.3f)
        {
            GameObject propPrefab = theme.sideObstacles[Random.Range(0, theme.sideObstacles.Length)];
            Vector3 leftPos = new Vector3(leftX - Random.Range(1f, 3f), 0f, spawnZ + Random.Range(2f, segmentLength - 2f));
            GameObject leftProp = Instantiate(propPrefab, leftPos, Quaternion.Euler(0f, 180f, 0f), parentSegment);
            
            // Set random plate number if prop is a parked vehicle/auto
            ApplyNumberPlateIfVehicle(leftProp, theme.licensePlateFormat);
        }

        // Right Side prop
        if (Random.value > 0.3f)
        {
            GameObject propPrefab = theme.sideObstacles[Random.Range(0, theme.sideObstacles.Length)];
            Vector3 rightPos = new Vector3(rightX + Random.Range(1f, 3f), 0f, spawnZ + Random.Range(2f, segmentLength - 2f));
            GameObject rightProp = Instantiate(propPrefab, rightPos, Quaternion.identity, parentSegment);

            ApplyNumberPlateIfVehicle(rightProp, theme.licensePlateFormat);
        }
    }

    private void ApplyNumberPlateIfVehicle(GameObject prop, string platePrefix)
    {
        // Simple logic: if the prop has a text component or is a vehicle, we could dynamically assign number plate text
        // E.g. platePrefix + " " + Random.Range(10, 99) + " " + (char)Random.Range('A', 'Z') + (char)Random.Range('A', 'Z') + " " + Random.Range(1000, 9999);
    }

    private void LoadThemeFromPrefs()
    {
        string selectedTheme = PlayerPrefs.GetString("SelectedTheme", "Tamil Nadu Village");
        for (int i = 0; i < themes.Count; i++)
        {
            if (themes[i].themeName == selectedTheme)
            {
                currentThemeIndex = i;
                return;
            }
        }
        currentThemeIndex = 0; // Default to first theme
    }
}
