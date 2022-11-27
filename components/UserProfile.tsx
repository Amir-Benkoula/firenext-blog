import { Avatar } from "@mui/material";

export default function UserProfile({ user }: any) {
  return (
    <div className="profile-card">
      <Avatar
        variant="circular"
        sx={{ width: 100, height: 100, marginRight: 2}}
        alt="Profile Pic"
        src={user?.photoURL || "/google.png"}
      />
      <div>
        <h2>{user.displayName || "Utilisateur Anonyme"}</h2>
        <p>
          <i>@{user.username}</i>
        </p>
      </div>
    </div>
  );
}
