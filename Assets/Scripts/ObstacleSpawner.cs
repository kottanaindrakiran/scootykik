using UnityEngine;
using System.Collections;
using System.Collections.Generic;

public class ObstacleSpawner : MonoBehaviour
{
    [System.Serializable]
    public struct SpawnItem
    {
        public string itemName;
        public GameObject prefab;
        [Range(0, 100)]
        public float spawnWeight; // Chance of spawning this item relative to others
        public bool isLaneSpecific; // If true, spawns exactly in the middle of a lane
    }

    [Header("Obstacles list")]
    public List<SpawnItem> obstaclePrefabs;

    [Header("Special Spawns")]
    public GameObject coinPrefab;
    public SpawnItem vvipConvoyPrefab;
    public SpawnItem slowZonePrefab;

    [Header("Lane Settings")]
    public float laneWidth = 3f;
    private float[] lanes = { -3f, 0f, 3f }; // Left, Middle, Right lane center X values

    [Header("Spawning Rates")]
    public float spawnProbability = 0.6f; // Chance of spawning obstacles on a segment
    public int maxObstaclesPerSegment = 2;
    public float minDistanceBetweenObstacles = 8f;

    [Header("Coin Settings")]
    public float coinSpawnProbability = 0.5f;
    public int coinsInRow = 4;

    public void SpawnObstaclesOnSegment(float segmentStartPointZ, float segmentLength)
    {
        // 1. Spawning Coins
        if (Random.value < coinSpawnProbability)
        {
            SpawnCoinPattern(segmentStartPointZ, segmentLength);
        }

        // 2. Spawning Obstacles
        if (Random.value < spawnProbability)
        {
            int obstacleCount = Random.Range(1, maxObstaclesPerSegment + 1);
            List<float> usedZCoordinates = new List<float>();

            for (int i = 0; i < obstacleCount; i++)
            {
                // Select a random lane
                int targetLaneIndex = Random.Range(0, lanes.Length);
                float spawnX = lanes[targetLaneIndex];

                // Select a random Z position along the segment
                float spawnZ = segmentStartPointZ + Random.Range(5f, segmentLength - 5f);

                // Check distance from other obstacles on this segment to avoid overlap
                bool tooClose = false;
                foreach (float z in usedZCoordinates)
                {
                    if (Mathf.Abs(z - spawnZ) < minDistanceBetweenObstacles)
                    {
                        tooClose = true;
                        break;
                    }
                }

                if (tooClose) continue;

                usedZCoordinates.Add(spawnZ);

                // Determine obstacle type based on weights
                SpawnItem selectedItem = ChooseObstacleByWeight();
                if (selectedItem.prefab != null)
                {
                    Vector3 position = new Vector3(
                        selectedItem.isLaneSpecific ? spawnX : spawnX + Random.Range(-0.5f, 0.5f),
                        selectedItem.prefab.transform.position.y,
                        spawnZ
                    );

                    GameObject obstacleInstance = Instantiate(selectedItem.prefab, position, Quaternion.identity);

                    // Add unique movement logic for dynamic obstacles (buses, trucks, pedestrians, dog, cow)
                    SetupDynamicBehavior(obstacleInstance, selectedItem.itemName);
                }
            }
        }
    }

    private void SpawnCoinPattern(float segmentStartPointZ, float segmentLength)
    {
        int coinLaneIndex = Random.Range(0, lanes.Length);
        float coinX = lanes[coinLaneIndex];
        float coinZStart = segmentStartPointZ + Random.Range(2f, segmentLength - (coinsInRow * 2.5f));

        // Pattern type: Line, Arc, or Wave
        int patternType = Random.Range(0, 2);

        for (int i = 0; i < coinsInRow; i++)
        {
            float z = coinZStart + (i * 2.5f);
            float y = 0.5f;

            if (patternType == 1) // Arc pattern
            {
                // Sine wave shape for vertical curve
                y = 0.5f + Mathf.Sin((i / (float)(coinsInRow - 1)) * Mathf.PI) * 1.5f;
            }

            Vector3 spawnPos = new Vector3(coinX, y, z);
            Instantiate(coinPrefab, spawnPos, Quaternion.Euler(0, Time.time * 50f, 0));
        }
    }

    private SpawnItem ChooseObstacleByWeight()
    {
        // Special case: check if we should spawn VVIP convoy (extremely rare)
        if (Random.value < 0.01f && vvipConvoyPrefab.prefab != null) // 1% chance
        {
            return vvipConvoyPrefab;
        }

        // Special case: check if we should spawn school zone (rare)
        if (Random.value < 0.05f && slowZonePrefab.prefab != null) // 5% chance
        {
            return slowZonePrefab;
        }

        float totalWeight = 0;
        foreach (var item in obstaclePrefabs)
        {
            totalWeight += item.spawnWeight;
        }

        float randomValue = Random.Range(0, totalWeight);
        float currentWeightSum = 0;

        foreach (var item in obstaclePrefabs)
        {
            currentWeightSum += item.spawnWeight;
            if (randomValue <= currentWeightSum)
            {
                return item;
            }
        }

        if (obstaclePrefabs.Count > 0)
        {
            return obstaclePrefabs[0];
        }
        return new SpawnItem();
    }

    private void SetupDynamicBehavior(GameObject obstacle, string name)
    {
        // If it's a moving obstacle like Auto Rickshaw, Truck, Bus or Cow
        if (name.Contains("Auto") || name.Contains("Bus") || name.Contains("Truck") || name.Contains("Bike"))
        {
            // Attach a simple AI driver script that moves the vehicle forward
            MovingTraffic trafficScript = obstacle.AddComponent<MovingTraffic>();
            trafficScript.speed = Random.Range(4f, 8f);
        }
        else if (name.Contains("Cow"))
        {
            // Attach a Cow AI script that can cross the road or run away when player horns
            CowAI cowScript = obstacle.AddComponent<CowAI>();
            cowScript.lanes = lanes;
        }
        else if (name.Contains("Dog") || name.Contains("Pedestrian"))
        {
            // Attach crossing script
            CrossingAI crossing = obstacle.AddComponent<CrossingAI>();
            crossing.speed = Random.Range(2f, 4f);
        }
    }
}

// Simple AI Behavior classes for Obstacles
public class MovingTraffic : MonoBehaviour
{
    public float speed = 5f;
    private Rigidbody rb;

    void Start()
    {
        rb = GetComponent<Rigidbody>();
        if (rb != null)
        {
            rb.isKinematic = true;
        }
    }

    void Update()
    {
        if (GameManager.isPaused || GameManager.isGameOver) return;
        // Traffic moves forward (slower than player, creating a overtaking flow)
        transform.Translate(Vector3.forward * speed * Time.deltaTime);
    }
}

public class CowAI : MonoBehaviour
{
    public float[] lanes;
    private bool isScared = false;
    private int currentTargetLane;
    private float targetX;
    private float moveSpeed = 4f;

    void Start()
    {
        // Place cow randomly on road
        if (lanes != null && lanes.Length > 0)
        {
            currentTargetLane = Random.Range(0, lanes.Length);
            targetX = lanes[currentTargetLane];
            Vector3 pos = transform.position;
            pos.x = targetX;
            transform.position = pos;
        }
    }

    void Update()
    {
        if (GameManager.isPaused || GameManager.isGameOver) return;

        if (isScared)
        {
            // Run off the road
            transform.Translate(Vector3.right * moveSpeed * Time.deltaTime);
            // Destroy if way off the road
            if (Mathf.Abs(transform.position.x) > 10f)
            {
                Destroy(gameObject);
            }
        }
        else
        {
            // Idle cow stands or occasionally slowly steps between lanes
            if (Random.value < 0.002f)
            {
                int nextLane = Mathf.Clamp(currentTargetLane + (Random.value > 0.5f ? 1 : -1), 0, lanes.Length - 1);
                currentTargetLane = nextLane;
                targetX = lanes[currentTargetLane];
            }
            Vector3 pos = transform.position;
            pos.x = Mathf.MoveTowards(pos.x, targetX, 1.5f * Time.deltaTime);
            transform.position = pos;
        }
    }

    public void Scare()
    {
        if (!isScared)
        {
            isScared = true;
            // Play cow sound or start running animation
        }
    }
}

public class CrossingAI : MonoBehaviour
{
    public float speed = 3f;
    private int direction = 1; // 1 = Left to Right, -1 = Right to Left

    void Start()
    {
        // Randomize crossing direction
        direction = Random.value > 0.5f ? 1 : -1;
        Vector3 pos = transform.position;
        pos.x = -direction * 6f; // Start off road
        transform.position = pos;

        // Rotate towards movement direction
        transform.rotation = Quaternion.Euler(0, direction > 0 ? 90 : -90, 0);
    }

    void Update()
    {
        if (GameManager.isPaused || GameManager.isGameOver) return;

        // Move across the road
        transform.Translate(Vector3.forward * speed * Time.deltaTime);

        // Self destroy when crossed
        if (Mathf.Abs(transform.position.x) > 8f)
        {
            Destroy(gameObject);
        }
    }
}
