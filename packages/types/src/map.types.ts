export interface DepartmentMap {
  id: string;
  departmentId: string;
  name: string;
  imageFileId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface MapPin {
  id: string;
  mapId: string;
  label: string;
  description: string;
  /** From 0 (left) to 1 (right) of the image. */
  x: number;
  /** From 0 (top) to 1 (bottom) of the image. */
  y: number;
  createdAt: string;
  updatedAt: string;
}

export interface DepartmentMapDetail extends DepartmentMap {
  pins: MapPin[];
}
