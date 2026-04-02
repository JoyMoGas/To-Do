export const Avatar = ({ profilePicture, username, size = 40 }) => {
  const getInitials = (name) => {
    if (!name) return "U";
    return name.charAt(0).toUpperCase();
  };

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        backgroundColor: "var(--accent-color)",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.45,
        fontWeight: "600",
        overflow: "hidden",
        border: "2px solid var(--border-color)",
        flexShrink: 0
      }}
    >
      {profilePicture ? (
        <img
          src={profilePicture}
          alt={username}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      ) : (
        getInitials(username)
      )}
    </div>
  );
};
