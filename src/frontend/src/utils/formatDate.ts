import { formatDistanceToNow, parseISO } from "date-fns";
import { toZonedTime } from "date-fns-tz";

export function formatDateInWords(dateString: string): string {
  const date = new Date(dateString);

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

  
export const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString)
      const localDate = toZonedTime(date, Intl.DateTimeFormat().resolvedOptions().timeZone)
      return formatDistanceToNow(localDate, { addSuffix: true })
    } catch (error) {
      console.error('Error formatting date:', error)
      return dateString // Return original string if parsing fails
    }
  }
  