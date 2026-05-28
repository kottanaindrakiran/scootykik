using UnityEngine;

public class CameraController : MonoBehaviour
{
    [Header("Target following")]
    public Transform target;
    public Vector3 offset = new Vector3(0f, 3.5f, -6.5f);
    public float smoothSpeed = 0.125f;

    [Header("Camera Shake")]
    private float shakeDuration = 0f;
    private float shakeMagnitude = 0.1f;
    private float dampingSpeed = 1.0f;
    private Vector3 initialOffset;

    void Start()
    {
        initialOffset = offset;
        if (target == null)
        {
            // Auto-locate player if not assigned
            GameObject player = GameObject.FindGameObjectWithTag("Player");
            if (player != null) target = player.transform;
        }
    }

    void LateUpdate()
    {
        if (target == null) return;

        // Target position behind player
        Vector3 targetPosition = target.position + offset;
        
        // Lock camera X rotation or dampen X movement so camera stays centered on road
        // The camera should smoothly interpolate horizontally, but keep lock on player
        Vector3 smoothedPosition = Vector3.Lerp(transform.position, targetPosition, smoothSpeed);
        
        // Handle Camera Shake
        if (shakeDuration > 0)
        {
            smoothedPosition += Random.insideUnitSphere * shakeMagnitude;
            shakeDuration -= Time.deltaTime * dampingSpeed;
        }

        transform.position = smoothedPosition;

        // Look at player slightly ahead or lock rotation
        Vector3 lookPos = target.position + Vector3.up * 1.5f;
        transform.LookAt(lookPos);
    }

    public void TriggerShake(float duration, float magnitude)
    {
        shakeDuration = duration;
        shakeMagnitude = magnitude;
    }
}
