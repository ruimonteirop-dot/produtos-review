import { useEffect, useState } from "react";
import { api } from "../lib/api";

export const usePublicReviews = () => {
  const [state, setState] = useState({ loading: true, reviews: [] });
  useEffect(() => {
    let alive = true;
    api.get("/reviews")
      .then((res) => alive && setState({ loading: false, reviews: Array.isArray(res.data) ? res.data : [] }))
      .catch(() => alive && setState({ loading: false, reviews: [] }));
    return () => { alive = false; };
  }, []);
  const featured = state.reviews.find((r) => r.featured) || state.reviews[0] || null;
  const others = state.reviews.filter((r) => r.id !== featured?.id);
  return { ...state, featured, others };
};
