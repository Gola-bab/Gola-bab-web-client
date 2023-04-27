import { useRouter } from 'next/router';
import { useCallback, useMemo } from 'react';

export default function useQuery() {
  const router = useRouter();

  const isDefault = useMemo(() => {
    const mode = router.query.mode as string;
    if (mode === 'custom' || mode === 'search' || mode === 'selects' || mode === 'pwa') return false;
    return true;
  }, [router.query]);

  const isSelects = useMemo(() => {
    const mode = router.query.mode as string;
    if (mode === 'selects') return true;
    return false;
  }, [router.query]);

  const isCustom = useMemo(() => {
    const mode = router.query.mode as string;
    if (mode === 'custom' || mode === 'selects') return true;
    return false;
  }, [router.query]);

  const isSearch = useMemo(() => {
    const search = router.query.search as string;
    if (search === 'true') return true;
    return false;
  }, [router.query]);

  const isShow = useMemo(() => {
    const isShow = router.query.isShow as string;
    return isShow === 'true';
  }, [router.query]);

  const drawer = useMemo(() => {
    const drawer = router.query.drawer as string;
    return drawer === 'open';
  }, [router.query]);

  const isPWA = useMemo(() => {
    const pwa = router.query.pwa as string;
    return pwa === 'true';
  }, [router.query]);

  function setQuery(key: string, value?: string) {
    const query = { ...router.query };
    if (value === undefined) {
      delete query[key];
    } else {
      query[key] = value;
    }
    router.push({
      pathname: router.asPath.split('?')[0],
      query,
    });
  }

  const toggleMode = useCallback(() => {
    if (isDefault) {
      setQuery('mode', 'custom');
    } else {
      setQuery('mode', 'default');
    }
  }, [isDefault]);

  const toggleSearch = useCallback(() => {
    if (isSearch) {
      setQuery('search');
    } else {
      setQuery('search', 'true');
    }
  }, [isSearch]);

  return { isDefault, isCustom, isShow, isSearch, isSelects, drawer, isPWA, setQuery, toggleMode, toggleSearch };
}
