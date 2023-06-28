export default function useRestaurantSlugFilter() {
    return {
        filter(text: string) {
            return text?.toLowerCase().replace(/([\uE000-\uF8FF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDDFF])/g, '')
            .replaceAll(' ', '-').replaceAll(/[^\w\s-]/gi, '');
        }
    };
}