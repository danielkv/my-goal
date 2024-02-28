import { Models } from 'goal-models'

export function isProgramSession(item: any): item is Models<'program_sessions'> {
    if (item.created_at && item.segment_id && item.name) return true

    return false
}

export function isProgramSegment(item: any): item is Models<'program_segments'> {
    if (item.created_at && item.program_id && item.name) return true

    return false
}

export function getYoutubeVideoId(url: string): string | null {
    const _url = new URL(url)

    return _url.searchParams.get('v') || _url.searchParams.get('videoId')
}
