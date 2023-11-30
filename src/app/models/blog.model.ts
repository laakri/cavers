export interface Blog {
  _id: string;
  title: string;
  shortDescription: string;
  blogImage: File;
  chartImage: File;
  text: string;
  selectedCategorys: string[]; // You can define the type based on your actual data structure.
  selectedMembershipLevels: string[]; // You can define the type based on your actual data structure.
  tags: string[];
  createdAt: string;
}
export interface TopBlogs {
  title: string;
  shortDescription: string;
}
