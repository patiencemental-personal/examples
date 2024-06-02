import { createServerSideClient } from "@/lib/supabase";

/**
 * 사용자 정보를 가져오는 actions
 */
export const getUser = async ({ serverComponent = false }) => {
  const supabase = await createServerSideClient(serverComponent);
  /**
   * supabase.auth.getSession - 서버의 메모리에서 사용자 인증 정보를 가져옴
   * supabase.auth.getUser - 디비에서 조회해서 사용자 인증 정보를 가져옴
   * 디비에서 조회하는게 데이터를 더 정확히 알 수 있음
   */
  // supabase.auth.getSession
  const user = await supabase.auth.getUser();

  return user?.data?.user;
};
