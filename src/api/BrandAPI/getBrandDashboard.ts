import { API } from ".."
import { useQuery } from "react-query"
import { DashboardDto } from "@/dtos/brand/Dashboard.dto"
import { Response } from "../types"

export const getDashboard = async () => {
  const { data } = await API.get<Response<DashboardDto>>("/brand/dashboard");

  return data;
}
export const useGetDashboard = () => {
  const query = useQuery(["dashboard"], () => getDashboard());

  const data = query.data;
  return {
    ...query,
    data,
  };
};