import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Circle,
  CircleMarker,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import {
  AlertTriangle,
  CheckCircle2,
  Crosshair,
  Filter,
  LocateFixed,
  Map as MapIcon,
  Navigation,
  RefreshCw,
  Search,
  ShieldCheck,
  XCircle,
} from "lucide-react";

import "leaflet/dist/leaflet.css";

import { useComplaints } from "@/hooks/useComplaints";

type IssueStatus =
  | "reported"
  | "in-progress"
  | "resolved"
  | "rejected";

type IssuePriority = "low" | "medium" | "high" | "critical";

interface CivicIssue {
  id: string;
  title: string;
  description?: string;
  category?: string;
  status?: IssueStatus | string;
  priority?: IssuePriority | string;
  latitude: number;
  longitude: number;
  location?: string;
  createdAt?: string;
}

interface UserLocation {
  latitude: number;
  longitude: number;
  accuracy: number;
  heading: number | null;
  speed: number | null;
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

const DEFAULT_LOCATION: [number, number] = [
  20.5937,
  78.9629,
];

const clamp = (
  value: number,
  min: number,
  max: number,
) => Math.min(Math.max(value, min), max);

const formatCoordinate = (value: number) =>
  Number.isFinite(value) ? value.toFixed(6) : "--";

const formatDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) => {
  const R = 6371000;

  const p1 = (lat1 * Math.PI) / 180;
  const p2 = (lat2 * Math.PI) / 180;

  const dp = ((lat2 - lat1) * Math.PI) / 180;
  const dl = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dp / 2) ** 2 +
    Math.cos(p1) *
      Math.cos(p2) *
      Math.sin(dl / 2) ** 2;

  const distance =
    R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  if (distance < 1000) {
    return `${Math.round(distance)} m`;
  }

  return `${(distance / 1000).toFixed(2)} km`;
};

const getStatusLabel = (status?: string) => {
  switch (status) {
    case "in-progress":
      return "In Progress";
    case "resolved":
      return "Resolved";
    case "rejected":
      return "Rejected";
    default:
      return "Reported";
  }
};

const getStatusClass = (status?: string) => {
  switch (status) {
    case "resolved":
      return "cp-map-status cp-map-status-success";

    case "in-progress":
      return "cp-map-status cp-map-status-warning";

    case "rejected":
      return "cp-map-status cp-map-status-danger";

    default:
      return "cp-map-status cp-map-status-info";
  }
};

const getPriorityClass = (priority?: string) => {
  switch (priority) {
    case "critical":
      return "cp-map-priority cp-map-priority-critical";

    case "high":
      return "cp-map-priority cp-map-priority-high";

    case "medium":
      return "cp-map-priority cp-map-priority-medium";

    default:
      return "cp-map-priority cp-map-priority-low";
  }
};

// -----------------------------------------------------------------------------
// User location marker
// -----------------------------------------------------------------------------

const createUserIcon = () =>
  L.divIcon({
    className: "cp-user-location-icon",
    html: `
      <div class="cp-user-location-marker">
        <div class="cp-user-location-pulse"></div>
        <div class="cp-user-location-dot">
          <div class="cp-user-location-arrow"></div>
        </div>
      </div>
    `,
    iconSize: [42, 42],
    iconAnchor: [21, 21],
  });

const userLocationIcon = createUserIcon();

// -----------------------------------------------------------------------------
// Civic issue marker
// -----------------------------------------------------------------------------

const createIssueIcon = (
  priority?: string,
  status?: string,
) => {
  let markerClass = "cp-issue-marker-info";

  if (status === "resolved") {
    markerClass = "cp-issue-marker-success";
  } else if (priority === "critical") {
    markerClass = "cp-issue-marker-critical";
  } else if (priority === "high") {
    markerClass = "cp-issue-marker-high";
  } else if (priority === "medium") {
    markerClass = "cp-issue-marker-medium";
  }

  return L.divIcon({
    className: "cp-issue-icon",
    html: `
      <div class="cp-issue-marker ${markerClass}">
        <span></span>
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -17],
  });
};

// -----------------------------------------------------------------------------
// Map controller
// -----------------------------------------------------------------------------

interface MapControllerProps {
  location: UserLocation | null;
  shouldRecenter: boolean;
  onRecenterComplete: () => void;
}

function MapController({
  location,
  shouldRecenter,
  onRecenterComplete,
}: MapControllerProps) {
  const map = useMap();

  useEffect(() => {
    if (!location) return;

    if (shouldRecenter) {
      map.flyTo(
        [location.latitude, location.longitude],
        Math.max(map.getZoom(), 16),
        {
          animate: true,
          duration: 0.8,
        },
      );

      onRecenterComplete();
    }
  }, [
    location,
    shouldRecenter,
    map,
    onRecenterComplete,
  ]);

  return null;
}

// -----------------------------------------------------------------------------
// Map interaction detector
// -----------------------------------------------------------------------------

function MapInteractionHandler({
  onUserInteraction,
}: {
  onUserInteraction: () => void;
}) {
  useMapEvents({
    dragstart: onUserInteraction,
    zoomstart: onUserInteraction,
  });

  return null;
}

// -----------------------------------------------------------------------------
// Main component
// -----------------------------------------------------------------------------

export default function CivicMapPage() {
  const {
    complaints,
    loading,
    error,
    refresh,
  } = useComplaints();

  const [userLocation, setUserLocation] =
    useState<UserLocation | null>(null);

  const [locationError, setLocationError] =
    useState<string | null>(null);

  const [locationPermission, setLocationPermission] =
    useState<
      "idle" | "requesting" | "granted" | "denied" | "unavailable"
    >("idle");

  const [isTracking, setIsTracking] =
    useState(false);

  const [shouldRecenter, setShouldRecenter] =
    useState(false);

  const [mapInteracted, setMapInteracted] =
    useState(false);

  const [searchQuery, setSearchQuery] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("all");

  const [priorityFilter, setPriorityFilter] =
    useState("all");

  const [selectedIssue, setSelectedIssue] =
    useState<CivicIssue | null>(null);

  const [showFilters, setShowFilters] =
    useState(false);

  const [locationTimestamp, setLocationTimestamp] =
    useState<Date | null>(null);

  // ---------------------------------------------------------------------------
  // Normalize complaint data
  // ---------------------------------------------------------------------------

  const issues = useMemo<CivicIssue[]>(() => {
    if (!Array.isArray(complaints)) {
      return [];
    }

    return complaints
      .map((item: any) => {
        const latitude = Number(
          item.latitude ??
            item.lat ??
            item.location?.latitude ??
            item.location?.lat,
        );

        const longitude = Number(
          item.longitude ??
            item.lng ??
            item.lon ??
            item.location?.longitude ??
            item.location?.lng,
        );

        if (
          !Number.isFinite(latitude) ||
          !Number.isFinite(longitude)
        ) {
          return null;
        }

        return {
          id: String(
            item.id ??
              item._id ??
              `${latitude}-${longitude}`,
          ),

          title:
            item.title ??
            item.issueTitle ??
            item.name ??
            "Civic Issue",

          description:
            item.description ??
            item.details ??
            "",

          category:
            item.category ??
            item.issueType ??
            "General",

          status:
            item.status ??
            "reported",

          priority:
            item.priority ??
            "medium",

          latitude: clamp(latitude, -90, 90),
          longitude: clamp(longitude, -180, 180),

          location:
            item.address ??
            item.locationName ??
            item.location?.address ??
            "Reported location",

          createdAt:
            item.createdAt ??
            item.created_at,
        };
      })
      .filter(Boolean) as CivicIssue[];
  }, [complaints]);

  // ---------------------------------------------------------------------------
  // Filter issues
  // ---------------------------------------------------------------------------

  const filteredIssues = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return issues.filter((issue) => {
      const matchesSearch =
        !query ||
        issue.title.toLowerCase().includes(query) ||
        issue.category
          ?.toLowerCase()
          .includes(query) ||
        issue.location
          ?.toLowerCase()
          .includes(query);

      const matchesStatus =
        statusFilter === "all" ||
        issue.status === statusFilter;

      const matchesPriority =
        priorityFilter === "all" ||
        issue.priority === priorityFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority
      );
    });
  }, [
    issues,
    searchQuery,
    statusFilter,
    priorityFilter,
  ]);

  // ---------------------------------------------------------------------------
  // Live geolocation
  // ---------------------------------------------------------------------------

  const handleLocationSuccess = useCallback(
    (position: GeolocationPosition) => {
      const {
        latitude,
        longitude,
        accuracy,
        heading,
        speed,
      } = position.coords;

      setUserLocation({
        latitude,
        longitude,
        accuracy,
        heading,
        speed,
      });

      setLocationPermission("granted");
      setLocationError(null);
      setLocationTimestamp(new Date());
      setIsTracking(true);
    },
    [],
  );

  const handleLocationError = useCallback(
    (error: GeolocationPositionError) => {
      setIsTracking(false);

      switch (error.code) {
        case error.PERMISSION_DENIED:
          setLocationPermission("denied");
          setLocationError(
            "Location permission was denied. Please allow location access in your browser.",
          );
          break;

        case error.POSITION_UNAVAILABLE:
          setLocationPermission("unavailable");
          setLocationError(
            "Your current location is temporarily unavailable.",
          );
          break;

        case error.TIMEOUT:
          setLocationError(
            "Location request timed out. Trying again...",
          );
          break;

        default:
          setLocationError(
            "Unable to determine your current location.",
          );
      }
    },
    [],
  );

  const startLiveLocation = useCallback(() => {
    if (!("geolocation" in navigator)) {
      setLocationPermission("unavailable");
      setLocationError(
        "Geolocation is not supported by this browser.",
      );
      return;
    }

    setLocationPermission("requesting");
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      handleLocationSuccess,
      handleLocationError,
      {
        enableHighAccuracy: true,
        maximumAge: 5000,
        timeout: 15000,
      },
    );

    const watchId =
      navigator.geolocation.watchPosition(
        handleLocationSuccess,
        handleLocationError,
        {
          enableHighAccuracy: true,
          maximumAge: 3000,
          timeout: 15000,
        },
      );

    (
      window as Window & {
        __civicPulseWatchId?: number;
      }
    ).__civicPulseWatchId = watchId;
  }, [
    handleLocationSuccess,
    handleLocationError,
  ]);

  useEffect(() => {
    startLiveLocation();

    return () => {
      const watchId = (
        window as Window & {
          __civicPulseWatchId?: number;
        }
      ).__civicPulseWatchId;

      if (typeof watchId === "number") {
        navigator.geolocation.clearWatch(
          watchId,
        );
      }
    };
  }, [startLiveLocation]);

  // ---------------------------------------------------------------------------
  // Recenter
  // ---------------------------------------------------------------------------

  const recenterMap = () => {
    if (!userLocation) {
      startLiveLocation();
      return;
    }

    setMapInteracted(false);
    setShouldRecenter(true);
  };

  const handleRecenterComplete = useCallback(() => {
    setShouldRecenter(false);
  }, []);

  // ---------------------------------------------------------------------------
  // Nearby issue statistics
  // ---------------------------------------------------------------------------

  const nearbyIssues = useMemo(() => {
    if (!userLocation) {
      return [];
    }

    return filteredIssues
      .map((issue) => ({
        issue,
        distance: formatDistance(
          userLocation.latitude,
          userLocation.longitude,
          issue.latitude,
          issue.longitude,
        ),
        rawDistance:
          Math.hypot(
            issue.latitude -
              userLocation.latitude,
            issue.longitude -
              userLocation.longitude,
          ),
      }))
      .sort(
        (a, b) =>
          a.rawDistance - b.rawDistance,
      );
  }, [
    filteredIssues,
    userLocation,
  ]);

  const nearbyCount = nearbyIssues.length;

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="cp-map-page">
      {/* ------------------------------------------------------------------ */}
      {/* Header                                                             */}
      {/* ------------------------------------------------------------------ */}

      <section className="cp-map-page-header">
        <div>
          <div className="cp-map-eyebrow">
            <MapIcon size={15} />
            LIVE CIVIC MAP
          </div>

          <h1 className="cp-map-title">
            Civic Issues Near You
          </h1>

          <p className="cp-map-subtitle">
            Real-time location tracking with live
            civic issue visualization.
          </p>
        </div>

        <div className="cp-map-live-indicator">
          <span
            className={
              isTracking
                ? "cp-live-dot cp-live-active"
                : "cp-live-dot"
            }
          />

          {isTracking
            ? "LIVE LOCATION"
            : "LOCATION OFF"}
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Location status                                                    */}
      {/* ------------------------------------------------------------------ */}

      {locationError && (
        <div className="cp-map-location-alert">
          <AlertTriangle size={18} />

          <div>
            <strong>Location unavailable</strong>
            <p>{locationError}</p>
          </div>

          <button
            type="button"
            className="cp-map-alert-action"
            onClick={startLiveLocation}
          >
            <RefreshCw size={15} />
            Retry
          </button>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Controls                                                           */}
      {/* ------------------------------------------------------------------ */}

      <section className="cp-map-toolbar">
        <div className="cp-map-search">
          <Search size={18} />

          <input
            type="search"
            placeholder="Search civic issues..."
            value={searchQuery}
            onChange={(event) =>
              setSearchQuery(event.target.value)
            }
          />

          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              aria-label="Clear search"
            >
              <XCircle size={17} />
            </button>
          )}
        </div>

        <div className="cp-map-actions">
          <button
            type="button"
            className={
              showFilters
                ? "cp-map-control cp-map-control-active"
                : "cp-map-control"
            }
            onClick={() =>
              setShowFilters((value) => !value)
            }
          >
            <Filter size={17} />
            Filters
          </button>

          <button
            type="button"
            className="cp-map-control cp-map-recenter"
            onClick={recenterMap}
          >
            <LocateFixed size={17} />
            Recenter
          </button>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Filters                                                            */}
      {/* ------------------------------------------------------------------ */}

      {showFilters && (
        <section className="cp-map-filter-panel">
          <div>
            <label htmlFor="map-status">
              Status
            </label>

            <select
              id="map-status"
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value)
              }
            >
              <option value="all">
                All Statuses
              </option>
              <option value="reported">
                Reported
              </option>
              <option value="in-progress">
                In Progress
              </option>
              <option value="resolved">
                Resolved
              </option>
              <option value="rejected">
                Rejected
              </option>
            </select>
          </div>

          <div>
            <label htmlFor="map-priority">
              Priority
            </label>

            <select
              id="map-priority"
              value={priorityFilter}
              onChange={(event) =>
                setPriorityFilter(event.target.value)
              }
            >
              <option value="all">
                All Priorities
              </option>
              <option value="critical">
                Critical
              </option>
              <option value="high">
                High
              </option>
              <option value="medium">
                Medium
              </option>
              <option value="low">
                Low
              </option>
            </select>
          </div>

          <div className="cp-map-filter-summary">
            Showing{" "}
            <strong>
              {filteredIssues.length}
            </strong>{" "}
            issues
          </div>
        </section>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Main map                                                           */}
      {/* ------------------------------------------------------------------ */}

      <section className="cp-map-layout">
        <div className="cp-map-card">
          <div className="cp-map-wrapper">
            <MapContainer
              center={DEFAULT_LOCATION}
              zoom={5}
              scrollWheelZoom
              className="cp-live-map"
              zoomControl
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <MapController
                location={userLocation}
                shouldRecenter={
                  shouldRecenter
                }
                onRecenterComplete={
                  handleRecenterComplete
                }
              />

              <MapInteractionHandler
                onUserInteraction={() =>
                  setMapInteracted(true)
                }
              />

              {/* ---------------------------------------------------------- */}
              {/* Current location                                           */}
              {/* ---------------------------------------------------------- */}

              {userLocation && (
                <>
                  <Circle
                    center={[
                      userLocation.latitude,
                      userLocation.longitude,
                    ]}
                    radius={Math.max(
                      userLocation.accuracy,
                      15,
                    )}
                    pathOptions={{
                      className:
                        "cp-location-accuracy-circle",
                      color: "var(--cp-primary)",
                      fillColor:
                        "var(--cp-primary)",
                      fillOpacity: 0.08,
                      weight: 1,
                    }}
                  />

                  <Marker
                    position={[
                      userLocation.latitude,
                      userLocation.longitude,
                    ]}
                    icon={userLocationIcon}
                  >
                    <Popup>
                      <div className="cp-map-popup cp-current-location-popup">
                        <div className="cp-popup-icon">
                          <Navigation
                            size={18}
                          />
                        </div>

                        <div>
                          <strong>
                            Your Current Location
                          </strong>

                          <span>
                            Accuracy:{" "}
                            {Math.round(
                              userLocation.accuracy,
                            )}
                            m
                          </span>

                          <span>
                            Lat:{" "}
                            {formatCoordinate(
                              userLocation.latitude,
                            )}
                          </span>

                          <span>
                            Lng:{" "}
                            {formatCoordinate(
                              userLocation.longitude,
                            )}
                          </span>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                </>
              )}

              {/* ---------------------------------------------------------- */}
              {/* Civic issue markers                                        */}
              {/* ---------------------------------------------------------- */}

              {filteredIssues.map((issue) => (
                <Marker
                  key={issue.id}
                  position={[
                    issue.latitude,
                    issue.longitude,
                  ]}
                  icon={createIssueIcon(
                    issue.priority,
                    issue.status,
                  )}
                  eventHandlers={{
                    click: () =>
                      setSelectedIssue(issue),
                  }}
                >
                  <Popup>
                    <div className="cp-map-popup">
                      <div className="cp-popup-heading">
                        <h3>
                          {issue.title}
                        </h3>

                        <span
                          className={getStatusClass(
                            issue.status,
                          )}
                        >
                          {getStatusLabel(
                            issue.status,
                          )}
                        </span>
                      </div>

                      {issue.description && (
                        <p>
                          {issue.description}
                        </p>
                      )}

                      <div className="cp-popup-meta">
                        <span>
                          Category:{" "}
                          <strong>
                            {issue.category}
                          </strong>
                        </span>

                        <span
                          className={getPriorityClass(
                            issue.priority,
                          )}
                        >
                          {issue.priority ??
                            "medium"}{" "}
                          priority
                        </span>

                        {userLocation && (
                          <span>
                            <Navigation
                              size={13}
                            />
                            {formatDistance(
                              userLocation.latitude,
                              userLocation.longitude,
                              issue.latitude,
                              issue.longitude,
                            )}
                          </span>
                        )}
                      </div>

                      <div className="cp-popup-location">
                        {issue.location}
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>

            {/* ------------------------------------------------------------ */}
            {/* Map overlays                                                  */}
            {/* ------------------------------------------------------------ */}

            <div className="cp-map-overlay-top">
              <div className="cp-map-status-card">
                <span
                  className={
                    isTracking
                      ? "cp-map-status-dot active"
                      : "cp-map-status-dot"
                  }
                />

                <div>
                  <strong>
                    {isTracking
                      ? "Tracking live"
                      : "Waiting for location"}
                  </strong>

                  <span>
                    {userLocation
                      ? `±${Math.round(
                          userLocation.accuracy,
                        )}m accuracy`
                      : "Requesting GPS..."}
                  </span>
                </div>
              </div>
            </div>

            {userLocation && mapInteracted && (
              <button
                type="button"
                className="cp-floating-recenter"
                onClick={recenterMap}
              >
                <Crosshair size={18} />
                Return to me
              </button>
            )}

            {locationPermission ===
              "requesting" && (
              <div className="cp-map-loading">
                <RefreshCw
                  size={20}
                  className="cp-spin"
                />
                <span>
                  Detecting your current
                  location...
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Right information panel                                          */}
        {/* ---------------------------------------------------------------- */}

        <aside className="cp-map-sidebar">
          {/* Current location */}

          <div className="cp-map-info-card cp-current-card">
            <div className="cp-info-card-header">
              <div className="cp-info-icon">
                <LocateFixed size={18} />
              </div>

              <div>
                <h3>
                  Your Location
                </h3>

                <span>
                  Live GPS position
                </span>
              </div>
            </div>

            {userLocation ? (
              <div className="cp-coordinate-grid">
                <div>
                  <span>Latitude</span>
                  <strong>
                    {formatCoordinate(
                      userLocation.latitude,
                    )}
                  </strong>
                </div>

                <div>
                  <span>Longitude</span>
                  <strong>
                    {formatCoordinate(
                      userLocation.longitude,
                    )}
                  </strong>
                </div>

                <div>
                  <span>Accuracy</span>
                  <strong>
                    ±
                    {Math.round(
                      userLocation.accuracy,
                    )}
                    m
                  </strong>
                </div>

                <div>
                  <span>Updated</span>
                  <strong>
                    {locationTimestamp
                      ? locationTimestamp.toLocaleTimeString()
                      : "--"}
                  </strong>
                </div>
              </div>
            ) : (
              <div className="cp-location-waiting">
                <RefreshCw
                  size={18}
                  className="cp-spin"
                />
                <span>
                  Waiting for GPS...
                </span>
              </div>
            )}

            <button
              type="button"
              className="cp-location-button"
              onClick={recenterMap}
            >
              <LocateFixed size={16} />
              Center on my location
            </button>
          </div>

          {/* Statistics */}

          <div className="cp-map-info-card">
            <div className="cp-info-card-header">
              <div className="cp-info-icon">
                <ShieldCheck size={18} />
              </div>

              <div>
                <h3>
                  Nearby Issues
                </h3>

                <span>
                  Live civic reports
                </span>
              </div>
            </div>

            <div className="cp-map-stat">
              <strong>
                {nearbyCount}
              </strong>

              <span>
                visible reports
              </span>
            </div>

            <div className="cp-stat-row">
              <span>
                <span className="cp-stat-dot reported" />
                Reported
              </span>

              <strong>
                {
                  filteredIssues.filter(
                    (item) =>
                      item.status ===
                      "reported",
                  ).length
                }
              </strong>
            </div>

            <div className="cp-stat-row">
              <span>
                <span className="cp-stat-dot progress" />
                In Progress
              </span>

              <strong>
                {
                  filteredIssues.filter(
                    (item) =>
                      item.status ===
                      "in-progress",
                  ).length
                }
              </strong>
            </div>

            <div className="cp-stat-row">
              <span>
                <span className="cp-stat-dot resolved" />
                Resolved
              </span>

              <strong>
                {
                  filteredIssues.filter(
                    (item) =>
                      item.status ===
                      "resolved",
                  ).length
                }
              </strong>
            </div>
          </div>

          {/* Nearby issues */}

          <div className="cp-map-info-card cp-nearby-card">
            <div className="cp-info-card-header">
              <div className="cp-info-icon">
                <AlertTriangle
                  size={18}
                />
              </div>

              <div>
                <h3>
                  Nearby Reports
                </h3>

                <span>
                  Closest to your position
                </span>
              </div>
            </div>

            <div className="cp-nearby-list">
              {loading ? (
                <div className="cp-empty-map">
                  <RefreshCw
                    size={18}
                    className="cp-spin"
                  />
                  Loading reports...
                </div>
              ) : nearbyIssues.length ===
                0 ? (
                <div className="cp-empty-map">
                  <CheckCircle2
                    size={20}
                  />
                  <span>
                    No civic issues found.
                  </span>
                </div>
              ) : (
                nearbyIssues
                  .slice(0, 5)
                  .map(
                    ({
                      issue,
                      distance,
                    }) => (
                      <button
                        type="button"
                        key={issue.id}
                        className="cp-nearby-item"
                        onClick={() =>
                          setSelectedIssue(
                            issue,
                          )
                        }
                      >
                        <div className="cp-nearby-marker">
                          <span />
                        </div>

                        <div className="cp-nearby-content">
                          <strong>
                            {issue.title}
                          </strong>

                          <span>
                            {issue.category}
                          </span>
                        </div>

                        <span className="cp-nearby-distance">
                          {distance}
                        </span>
                      </button>
                    ),
                  )
              )}
            </div>
          </div>

          {/* Refresh */}

          <button
            type="button"
            className="cp-map-refresh"
            onClick={refresh}
          >
            <RefreshCw size={16} />
            Refresh civic reports
          </button>
        </aside>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Legend                                                             */}
      {/* ------------------------------------------------------------------ */}

      <section className="cp-map-legend">
        <div className="cp-legend-title">
          <span>MAP LEGEND</span>
          <small>
            Live civic information
          </small>
        </div>

        <div className="cp-legend-items">
          <div>
            <span className="cp-legend-user">
              <span />
            </span>
            <span>
              Your location
            </span>
          </div>

          <div>
            <span className="cp-legend-marker critical">
              <span />
            </span>
            <span>
              Critical
            </span>
          </div>

          <div>
            <span className="cp-legend-marker high">
              <span />
            </span>
            <span>
              High priority
            </span>
          </div>

          <div>
            <span className="cp-legend-marker medium">
              <span />
            </span>
            <span>
              Medium priority
            </span>
          </div>

          <div>
            <span className="cp-legend-marker resolved">
              <span />
            </span>
            <span>
              Resolved
            </span>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Selected issue                                                     */}
      {/* ------------------------------------------------------------------ */}

      {selectedIssue && (
        <div
          className="cp-map-selected-banner"
          role="status"
        >
          <div>
            <strong>
              {selectedIssue.title}
            </strong>

            <span>
              {selectedIssue.location}
            </span>
          </div>

          <button
            type="button"
            onClick={() =>
              setSelectedIssue(null)
            }
            aria-label="Close selected issue"
          >
            <XCircle size={20} />
          </button>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* API error                                                          */}
      {/* ------------------------------------------------------------------ */}

      {error && (
        <div className="cp-map-api-error">
          <AlertTriangle size={17} />
          Unable to load some civic reports.
        </div>
      )}
    </div>
  );
}