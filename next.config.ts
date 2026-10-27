import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Next 16은 여기 적은 품질만 받는다. 50은 어두운 막 아래에 깔리는 사진(후원하기 '우리가 하는 일')에만 쓴다.
    qualities: [50, 75],
  },
};

export default nextConfig;
