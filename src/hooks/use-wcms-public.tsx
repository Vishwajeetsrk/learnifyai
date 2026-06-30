import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { wcmsGetPublicFeatures, wcmsGetPublicMenu, wcmsGetPublicSection } from "@/lib/wcms-public.functions";

// ═══════════════════════════════════════════════════════════════
// Public WCMS Hooks — No auth required. Use anywhere on the site.
// ═══════════════════════════════════════════════════════════════

export function usePublicFeatures() {
  const getFeaturesFn = useServerFn(wcmsGetPublicFeatures);
  return useQuery({
    queryKey: ["wcms-public-features"],
    queryFn: () => getFeaturesFn(),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
}

export function usePublicMenu(menuKey: string = "main") {
  const getMenuFn = useServerFn(wcmsGetPublicMenu);
  return useQuery({
    queryKey: ["wcms-public-menu", menuKey],
    queryFn: () => getMenuFn({ data: { menuKey } }),
    staleTime: 5 * 60 * 1000,
  });
}

export function useMenuTree(menuKey: string = "main") {
  const { data: items = [], ...rest } = usePublicMenu(menuKey);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const root = items.filter((i: any) => !i.parent_id);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const children = (parentId: string) => items.filter((i: any) => i.parent_id === parentId);
  return { root, children, items, ...rest };
}

export function usePublicSection(key: string) {
  const getSectionFn = useServerFn(wcmsGetPublicSection);
  return useQuery({
    queryKey: ["wcms-public-section", key],
    queryFn: () => getSectionFn({ data: { key } }),
    staleTime: 5 * 60 * 1000,
  });
}
