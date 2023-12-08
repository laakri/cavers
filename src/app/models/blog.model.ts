export interface Blog {
  title: string;
  shortDescription: string;
  text: string;
  selectedCategorys: string[];
  selectedMembershipLevels: string;
  tags: string[];
  blogImage: File; // File object for the blog image
  chartImage: File; // File object for the chart image
}
export interface Blogs {
  _id: string;
  title: string;
  shortDescription: string;
  blogImage: File;
  selectedCategorys: string[];
  tags: string[];
  createdAt: string;
  selectedMembershipLevels: string;
}
export interface TopBlogs {
  title: string;
  shortDescription: string;
}
