import {
  getBrand,
  useGetBrand
  // getBrandProfile,
  // useGetBrandProfile,
} from "./getBrand";
import { listBrand, useListBrand } from "./listBrand";
import { createBrand } from "./createBrand";
import { deleteBrand, useDeleteBrand } from "./deleteBrand";
import {
  updateBrand,
} from "./updateBrand";
import { getBrandProfile, useGetBrandProfile } from "./getBrand";
import { getDashboard, useGetDashboard} from "./getBrandDashboard";

const BrandAPI = {
  getBrand,
  useGetBrand,
  getBrandProfile,
  useGetBrandProfile,
  listBrand,
  useListBrand,
  createBrand,
  deleteBrand,
  useDeleteBrand,
  updateBrand,
  getDashboard,
  useGetDashboard,
};

export default BrandAPI;
