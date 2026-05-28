using UnityEngine;
using System;
#if USE_ADMOB
using GoogleMobileAds.Api;
#endif

public class AdMobManager : MonoBehaviour
{
    public static AdMobManager Instance { get; private set; }

    [Header("Ad Unit IDs (Test IDs by default)")]
    public string bannerAdUnitId = "ca-app-pub-3940256099942544/6300978111"; // Android test banner
    public string interstitialAdUnitId = "ca-app-pub-3940256099942544/1033173712"; // Android test interstitial
    public string rewardedAdUnitId = "ca-app-pub-3940256099942544/5224354917"; // Android test rewarded

    private Action<bool> onRewardedCallback;

#if USE_ADMOB
    private BannerView bannerView;
    private InterstitialAd interstitialAd;
    private RewardedAd rewardedAd;
#endif

    void Awake()
    {
        if (Instance == null)
        {
            Instance = this;
            DontDestroyOnLoad(gameObject);
        }
        else
        {
            Destroy(gameObject);
        }
    }

    void Start()
    {
#if USE_ADMOB
        // Initialize the Google Mobile Ads SDK.
        MobileAds.Initialize((InitializationStatus initStatus) =>
        {
            Debug.Log("AdMob SDK Initialized.");
            // Load ads on start
            RequestBanner();
            LoadInterstitialAd();
            LoadRewardedAd();
        });
#else
        Debug.LogWarning("USE_ADMOB symbol not defined. Using mock AdMobManager.");
#endif
    }

    #region Banner Ads
    public void RequestBanner()
    {
#if USE_ADMOB
        if (bannerView != null) bannerView.Destroy();

        AdSize adSize = AdSize.Banner;
        bannerView = new BannerView(bannerAdUnitId, adSize, AdPosition.Bottom);

        AdRequest request = new AdRequest();
        bannerView.LoadAd(request);
#else
        Debug.Log("Mock AdMob: Banner Requested");
#endif
    }

    public void ShowBanner(bool show)
    {
#if USE_ADMOB
        if (bannerView != null)
        {
            if (show) bannerView.Show();
            else bannerView.Hide();
        }
#else
        Debug.Log("Mock AdMob: Banner Visibility: " + show);
#endif
    }
    #endregion

    #region Interstitial Ads
    public void LoadInterstitialAd()
    {
#if USE_ADMOB
        if (interstitialAd != null) interstitialAd.Destroy();

        AdRequest request = new AdRequest();
        InterstitialAd.Load(interstitialAdUnitId, request, (InterstitialAd ad, LoadAdError error) =>
        {
            if (error != null || ad == null)
            {
                Debug.LogError("Interstitial ad failed to load: " + error);
                return;
            }
            interstitialAd = ad;
            
            // Set up ad events
            interstitialAd.OnAdFullScreenContentClosed += () =>
            {
                Debug.Log("Interstitial closed.");
                LoadInterstitialAd(); // Reload for next run
            };
        });
#else
        Debug.Log("Mock AdMob: Loading Interstitial Ad");
#endif
    }

    public void ShowInterstitialAd()
    {
#if USE_ADMOB
        if (interstitialAd != null && interstitialAd.CanShowAd())
        {
            interstitialAd.Show();
        }
        else
        {
            Debug.LogWarning("Interstitial ad not ready. Reloading...");
            LoadInterstitialAd();
        }
#else
        Debug.Log("Mock AdMob: Showing Interstitial Ad");
#endif
    }
    #endregion

    #region Rewarded Ads
    public void LoadRewardedAd()
    {
#if USE_ADMOB
        if (rewardedAd != null) rewardedAd.Destroy();

        AdRequest request = new AdRequest();
        RewardedAd.Load(rewardedAdUnitId, request, (RewardedAd ad, LoadAdError error) =>
        {
            if (error != null || ad == null)
            {
                Debug.LogError("Rewarded ad failed to load: " + error);
                return;
            }
            rewardedAd = ad;

            // Ad events
            rewardedAd.OnAdFullScreenContentClosed += () =>
            {
                Debug.Log("Rewarded ad closed.");
                LoadRewardedAd(); // Reload for next reward request
            };
        });
#else
        Debug.Log("Mock AdMob: Loading Rewarded Ad");
#endif
    }

    public void ShowRewardedAd(Action<bool> callback)
    {
        onRewardedCallback = callback;

#if USE_ADMOB
        if (rewardedAd != null && rewardedAd.CanShowAd())
        {
            rewardedAd.Show((Reward reward) =>
            {
                Debug.Log("User rewarded: " + reward.Amount + " " + reward.Type);
                if (onRewardedCallback != null)
                {
                    onRewardedCallback(true);
                    onRewardedCallback = null;
                }
            });
        }
        else
        {
            Debug.LogError("Rewarded ad not ready. Invoking mock fail-safe reward.");
            if (onRewardedCallback != null)
            {
                onRewardedCallback(true); // Failsafe reward
                onRewardedCallback = null;
            }
            LoadRewardedAd();
        }
#else
        Debug.Log("Mock AdMob: Showing Rewarded Ad. Granting reward!");
        if (onRewardedCallback != null)
        {
            onRewardedCallback(true);
            onRewardedCallback = null;
        }
#endif
    }
    #endregion
}
