import { Avatar } from "@mui/material";

export default function UserProfile({ user }: any) {
  return (
    <div className="box-center">
      <Avatar
        variant="square"
        sx={{ width: 100, height: 100, marginRight: 2, borderRadius: 1.5 }}
        alt="Profile Pic"
        src={user?.photoURL || "/google.png"}
      />
      <div>
        <h1>{user.displayName || "Utilisateur Anonyme"}</h1>
        <p>
          <i>@{user.username}</i>
        </p>
      </div>
    </div>
  );
}
