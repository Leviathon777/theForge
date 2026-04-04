import { useEffect } from "react";
import { useRouter } from "next/router";

const InvestorWallet = () => {
  const router = useRouter();
  useEffect(() => { router.replace("/account"); }, []);
  return null;
};

export default InvestorWallet;
