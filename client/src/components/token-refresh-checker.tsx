import useTokenRefresh from "@/hooks/use-token-refresh";

const TokenRefreshChecker = () => {
  useTokenRefresh();
  return null;
};

export default TokenRefreshChecker;
