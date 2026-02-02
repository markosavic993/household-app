import { getUserName } from "@/services/userService";
import { useEffect, useState } from "react";

export function useUserName(userId: string | null | undefined) {
  const [userName, setUserName] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setUserName("");
      setLoading(false);
      return;
    }

    const fetchUserName = async () => {
      try {
        const name = await getUserName(userId);
        console.log(name);
        setUserName(name);
      } catch (error) {
        console.error("Error fetching user name:", error);
        setUserName("Unknown");
      } finally {
        setLoading(false);
      }
    };

    fetchUserName();
  }, [userId]);

  return { userName, loading };
}
