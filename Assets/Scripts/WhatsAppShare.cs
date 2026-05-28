using UnityEngine;
using System.Collections;
using System.IO;

public class WhatsAppShare : MonoBehaviour
{
    public void ShareScoreCard()
    {
        StartCoroutine(CaptureAndShare());
    }

    private IEnumerator CaptureAndShare()
    {
        yield return new WaitForEndOfFrame();

        // 1. Take Screenshot
        Texture2D ss = new Texture2D(Screen.width, Screen.height, TextureFormat.RGB24, false);
        ss.ReadPixels(new Rect(0, 0, Screen.width, Screen.height), 0, 0);
        ss.Apply();

        // 2. Save PNG to Temporary Local Storage
        string filePath = Path.Combine(Application.temporaryCachePath, "ScootyKik_ScoreCard.png");
        File.WriteAllBytes(filePath, ss.EncodeToPNG());
        
        // Clean up memory
        Destroy(ss);

        // Get run info to display as text caption
        string selectedChar = PlayerPrefs.GetString("SelectedCharacter", "Default Boy");
        string selectedVehicle = PlayerPrefs.GetString("SelectedVehicle", "Scooty");
        float distance = GameManager.Instance != null ? GameManager.Instance.GetDistanceKM() : 0f;
        int coins = GameManager.Instance != null ? GameManager.Instance.coinsCollectedThisRun : 0;

        string shareText = $"*Ride India. Feel India!* 🛵🇮🇳\n" +
                           $"I just scored *{distance} KM* riding a *{selectedVehicle}* as *{selectedChar}* in *ScootyKik*!\n" +
                           $"Collected: 🪙 *{coins} coins*\n" +
                           $"Download ScootyKik now and beat my score! #ScootyKik #RideIndia";

        // 3. Trigger Android Share Intent
#if UNITY_ANDROID && !UNITY_EDITOR
        AndroidJavaClass intentClass = new AndroidJavaClass("android.content.Intent");
        AndroidJavaObject intentObject = new AndroidJavaObject("android.content.Intent");
        
        intentObject.Call<AndroidJavaObject>("setAction", intentClass.GetStatic<string>("ACTION_SEND"));
        
        // Attach image path using FileProvider (required on Android 7.0+)
        AndroidJavaClass uriClass = new AndroidJavaClass("android.net.Uri");
        AndroidJavaClass unityPlayer = new AndroidJavaClass("com.unity3d.player.UnityPlayer");
        AndroidJavaObject currentActivity = unityPlayer.GetStatic<AndroidJavaObject>("currentActivity");
        
        // Resolve package authority for FileProvider
        string packageName = currentActivity.Call<string>("getPackageName");
        string authority = packageName + ".fileprovider";
        
        AndroidJavaObject fileObject = new AndroidJavaObject("java.io.File", filePath);
        AndroidJavaClass fileProviderClass = new AndroidJavaClass("androidx.core.content.FileProvider");
        AndroidJavaObject uriObject = fileProviderClass.CallStatic<AndroidJavaObject>("getUriForFile", currentActivity, authority, fileObject);
        
        // Set type and attachments
        intentObject.Call<AndroidJavaObject>("setType", "image/png");
        intentObject.Call<AndroidJavaObject>("putExtra", intentClass.GetStatic<string>("EXTRA_STREAM"), uriObject);
        intentObject.Call<AndroidJavaObject>("putExtra", intentClass.GetStatic<string>("EXTRA_TEXT"), shareText);
        
        // Grant temporary read permission to resolving app
        intentObject.Call<AndroidJavaObject>("addFlags", intentClass.GetStatic<int>("FLAG_GRANT_READ_URI_PERMISSION"));

        // Direct target to WhatsApp specifically if available, else show chooser
        try
        {
            intentObject.Call<AndroidJavaObject>("setPackage", "com.whatsapp");
            currentActivity.Call("startActivity", intentObject);
        }
        catch (System.Exception ex)
        {
            // WhatsApp not installed - fallback to general chooser
            AndroidJavaObject chooser = intentClass.CallStatic<AndroidJavaObject>("createChooser", intentObject, "Share Score Card via:");
            currentActivity.Call("startActivity", chooser);
        }
#else
        Debug.Log("Sharing Score Card (Simulated): " + shareText);
        Debug.Log("Image Saved At: " + filePath);
#endif
    }
}
