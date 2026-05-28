using UnityEngine;
using System.Collections;

public class PlayerController : MonoBehaviour
{
    [Header("Movement & Lanes")]
    public float laneWidth = 3f;
    public float laneSwitchSpeed = 15f;
    public float currentSpeed = 10f;
    public float maxSpeed = 30f;
    public float acceleration = 0.5f;

    [Header("State")]
    public int currentLane = 1; // 0 = Left, 1 = Middle, 2 = Right
    private float targetX = 0f;
    private bool isMoving = true;
    private bool isStunned = false;
    private bool isBoosting = false;

    [Header("Stats")]
    public float baseSpeedStat = 5f; // 1-10
    public float baseControlStat = 5f; // 1-10
    public float baseStaminaStat = 5f; // 1-10
    public float stamina = 100f;
    public float maxStamina = 100f;

    [Header("Audio Source")]
    public AudioSource engineAudio;
    public AudioSource hornAudio;
    public AudioClip hornClip;
    public AudioClip crashClip;
    public AudioClip coinClip;
    public AudioClip boostClip;

    [Header("Physics & Bounce")]
    private Rigidbody rb;
    private float verticalVelocity = 0f;

    private GameManager gameManager;

    void Start()
    {
        rb = GetComponent<Rigidbody>();
        gameManager = FindObjectOfType<GameManager>();

        // Load stats based on selected character and vehicle
        LoadSelectedStats();

        targetX = (currentLane - 1) * laneWidth;
        stamina = maxStamina;

        if (engineAudio != null)
        {
            engineAudio.loop = true;
            engineAudio.Play();
        }
    }

    void Update()
    {
        if (!isMoving || GameManager.isPaused || GameManager.isGameOver)
        {
            if (engineAudio != null && engineAudio.isPlaying) engineAudio.Pause();
            return;
        }

        if (engineAudio != null && !engineAudio.isPlaying)
        {
            engineAudio.UnPause();
        }

        // Apply automatic acceleration over time
        if (!isBoosting && !isStunned)
        {
            currentSpeed = Mathf.Min(currentSpeed + acceleration * Time.deltaTime, maxSpeed + (baseSpeedStat * 0.5f));
        }

        // Engine sound modulation based on speed
        if (engineAudio != null)
        {
            engineAudio.pitch = Mathf.Lerp(0.8f, 1.8f, currentSpeed / (maxSpeed + 5f));
        }

        // Handle Stamina recovery
        if (!isBoosting && stamina < maxStamina)
        {
            stamina = Mathf.Min(stamina + (baseStaminaStat * 1.5f) * Time.deltaTime, maxStamina);
        }

        // Input
        HandleInput();
    }

    void FixedUpdate()
    {
        if (!isMoving || GameManager.isPaused || GameManager.isGameOver) return;

        // Smooth horizontal movement towards the target lane X position
        Vector3 pos = transform.position;
        float step = laneSwitchSpeed * (baseControlStat / 5f) * Time.fixedDeltaTime;
        pos.x = Mathf.MoveTowards(pos.x, targetX, step);

        // Move forward
        float forwardStep = currentSpeed * Time.fixedDeltaTime;
        pos.z += forwardStep;

        rb.MovePosition(pos);
    }

    private void HandleInput()
    {
        // Lane switching keys / touchscreen swipe logic
        if (Input.GetKeyDown(KeyCode.LeftArrow) || Input.GetKeyDown(KeyCode.A))
        {
            MoveLaneLeft();
        }
        else if (Input.GetKeyDown(KeyCode.RightArrow) || Input.GetKeyDown(KeyCode.D))
        {
            MoveLaneRight();
        }

        // Horn input
        if (Input.GetKeyDown(KeyCode.H) || Input.GetKeyDown(KeyCode.Space))
        {
            BlowHorn();
        }

        // Speed boost input
        if (Input.GetKey(KeyCode.LeftShift) || Input.GetKey(KeyCode.RightShift))
        {
            ActivateBoost(true);
        }
        else
        {
            ActivateBoost(false);
        }
    }

    public void MoveLaneLeft()
    {
        if (isStunned) return;
        if (currentLane > 0)
        {
            currentLane--;
            targetX = (currentLane - 1) * laneWidth;
        }
    }

    public void MoveLaneRight()
    {
        if (isStunned) return;
        if (currentLane < 2)
        {
            currentLane++;
            targetX = (currentLane - 1) * laneWidth;
        }
    }

    public void BlowHorn()
    {
        if (hornAudio != null && hornClip != null)
        {
            hornAudio.PlayOneShot(hornClip);
            // Scare obstacles ahead
            ScareNearbyCows();
        }
    }

    public void ActivateBoost(bool active)
    {
        if (isStunned) return;

        if (active && stamina > 5f)
        {
            if (!isBoosting)
            {
                isBoosting = true;
                currentSpeed += 8f;
                if (hornAudio != null && boostClip != null)
                {
                    hornAudio.PlayOneShot(boostClip, 0.5f);
                }
            }
            // Drain stamina
            stamina = Mathf.Max(stamina - 25f * Time.deltaTime, 0f);
            if (stamina <= 0f)
            {
                ActivateBoost(false);
            }
        }
        else
        {
            if (isBoosting)
            {
                isBoosting = false;
                currentSpeed = Mathf.Max(currentSpeed - 8f, 10f);
            }
        }
    }

    private void ScareNearbyCows()
    {
        Collider[] colliders = Physics.OverlapSphere(transform.position, 15f);
        foreach (var col in colliders)
        {
            if (col.CompareTag("Cow"))
            {
                // Trigger cow running away
                col.SendMessage("Scare", SendMessageOptions.DontRequireReceiver);
            }
        }
    }

    private void LoadSelectedStats()
    {
        // Load vehicle stats
        string selectedVehicle = PlayerPrefs.GetString("SelectedVehicle", "Scooty");
        float vSpeed = 5f, vControl = 5f, vStamina = 5f;
        switch (selectedVehicle)
        {
            case "Scooty":
                vSpeed = 5f; vControl = 6f; vStamina = 6f;
                break;
            case "Bike":
                vSpeed = 7f; vControl = 4f; vStamina = 5f;
                break;
            case "Auto Rickshaw":
                vSpeed = 3f; vControl = 6f; vStamina = 4f;
                break;
            case "Race Car":
                vSpeed = 9f; vControl = 3f; vStamina = 7f;
                break;
            case "Cycle":
                vSpeed = 2f; vControl = 8f; vStamina = 9f;
                break;
        }

        // Load character stats
        string selectedChar = PlayerPrefs.GetString("SelectedCharacter", "Default Boy");
        float cSpeed = 0f, cControl = 0f, cStamina = 0f;
        switch (selectedChar)
        {
            case "Default Boy": cSpeed = 0f; cControl = 0f; cStamina = 0f; break;
            case "Casual Boy": cSpeed = 0.5f; cControl = 0f; cStamina = 0f; break;
            case "Punjabi Style": cSpeed = 0.5f; cControl = 0.5f; cStamina = 0.5f; break;
            case "Village Boy": cSpeed = 0f; cControl = 0.5f; cStamina = 1.0f; break;
            case "Farmer Boy": cSpeed = 0f; cControl = 0.5f; cStamina = 1.0f; break;
            case "Street Style": cSpeed = 1.0f; cControl = 0.5f; cStamina = 0.5f; break;
            case "Royal Look": cSpeed = 1.0f; cControl = 1.0f; cStamina = 0.5f; break;
            case "Royal Punjabi": cSpeed = 1.0f; cControl = 1.0f; cStamina = 1.0f; break;
            case "Backpacker": cSpeed = 0.5f; cControl = 0.5f; cStamina = 1.0f; break;
            case "Youngster": cSpeed = 0.5f; cControl = 0.5f; cStamina = 0f; break;
        }

        baseSpeedStat = vSpeed + cSpeed;
        baseControlStat = vControl + cControl;
        baseStaminaStat = vStamina + cStamina;

        currentSpeed = 8f + (baseSpeedStat * 0.5f);
        maxSpeed = 25f + (baseSpeedStat * 1f);
    }

    private void OnTriggerEnter(Collider other)
    {
        if (other.CompareTag("Coin"))
        {
            CollectCoin(other.gameObject);
        }
        else if (other.CompareTag("Pothole"))
        {
            StartCoroutine(PotholeSlowdown());
        }
        else if (other.CompareTag("SpeedBreaker"))
        {
            ApplyBounce();
        }
        else if (other.CompareTag("VVIP_Convoy"))
        {
            Crash(true); // Instant Game Over
        }
        else if (other.CompareTag("SlowZone"))
        {
            StartCoroutine(SlowZoneZone(other));
        }
        else if (other.CompareTag("Obstacle") || other.CompareTag("Cow") || other.CompareTag("Traffic"))
        {
            Crash(false);
        }
    }

    private void CollectCoin(GameObject coinObj)
    {
        if (hornAudio != null && coinClip != null)
        {
            hornAudio.PlayOneShot(coinClip, 0.4f);
        }
        Destroy(coinObj);
        if (gameManager != null)
        {
            gameManager.AddCoin();
        }
    }

    private IEnumerator PotholeSlowdown()
    {
        if (isStunned) yield break;
        isStunned = true;
        float prevSpeed = currentSpeed;
        currentSpeed = Mathf.Max(currentSpeed * 0.4f, 4f);
        yield return new WaitForSeconds(1.5f);
        currentSpeed = prevSpeed;
        isStunned = false;
    }

    private void ApplyBounce()
    {
        // Simple visual bounce trigger or upward physics nudge
        rb.velocity = new Vector3(rb.velocity.x, 5f, rb.velocity.y);
        StartCoroutine(TemporarySlowdown(0.5f, 0.8f));
    }

    private IEnumerator TemporarySlowdown(float duration, float factor)
    {
        float prevSpeed = currentSpeed;
        currentSpeed *= factor;
        yield return new WaitForSeconds(duration);
        currentSpeed = prevSpeed;
    }

    private IEnumerator SlowZoneZone(Collider col)
    {
        float prevMax = maxSpeed;
        maxSpeed = 10f;
        currentSpeed = Mathf.Min(currentSpeed, maxSpeed);
        while (col != null && col.bounds.Contains(transform.position))
        {
            yield return null;
        }
        maxSpeed = prevMax;
    }

    private void Crash(bool instantGameOver)
    {
        isMoving = false;
        if (engineAudio != null) engineAudio.Stop();
        if (hornAudio != null && crashClip != null)
        {
            hornAudio.PlayOneShot(crashClip);
        }

        // Camera Shake effect
        CameraController cam = FindObjectOfType<CameraController>();
        if (cam != null) cam.TriggerShake(0.5f, 0.3f);

        if (gameManager != null)
        {
            gameManager.GameOver(instantGameOver);
        }
    }

    public void Revive()
    {
        isMoving = true;
        isStunned = false;
        isBoosting = false;
        currentLane = 1;
        targetX = 0f;
        Vector3 pos = transform.position;
        pos.x = 0f;
        transform.position = pos;
        currentSpeed = 8f + (baseSpeedStat * 0.5f);
        stamina = maxStamina;

        if (engineAudio != null)
        {
            engineAudio.Play();
        }
    }
}
