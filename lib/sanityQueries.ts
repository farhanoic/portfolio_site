// GROQ queries for fetching service data from Sanity

export const SERVICE_CATEGORIES_QUERY = `
  *[_type == "serviceCategory"] | order(order asc) {
    _id,
    name,
    slug,
    description,
    icon,
    order
  }
`

export const SERVICE_FILTERS_QUERY = `
  *[_type == "serviceFilter"] | order(order asc) {
    _id,
    name,
    slug,
    category->{
      _id,
      slug
    },
    order
  }
`

export const SERVICE_ITEMS_QUERY = `
  *[_type == "serviceItem" && isActive == true] | order(order asc) {
    _id,
    title,
    description,
    category->{
      _id,
      name,
      slug
    },
    filter->{
      _id,
      name,
      slug
    },
    thumbnail,
    previewVideo,
    gallery,
    price,
    duration,
    features,
    tags,
    difficulty,
    order
  }
`

export const SERVICE_ITEMS_BY_CATEGORY_QUERY = `
  *[_type == "serviceItem" && isActive == true && category->slug == $categorySlug] | order(order asc) {
    _id,
    title,
    description,
    category->{
      _id,
      name,
      slug
    },
    filter->{
      _id,
      name,
      slug
    },
    thumbnail,
    previewVideo,
    gallery,
    price,
    duration,
    features,
    tags,
    difficulty,
    order
  }
`

export const SERVICE_ITEM_BY_ID_QUERY = `
  *[_type == "serviceItem" && _id == $id][0] {
    _id,
    title,
    description,
    category->{
      _id,
      name,
      slug
    },
    filter->{
      _id,
      name,
      slug
    },
    thumbnail,
    previewVideo,
    gallery,
    price,
    duration,
    features,
    tags,
    difficulty,
    order
  }
`