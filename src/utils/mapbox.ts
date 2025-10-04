export function mapboxInterceptor(url: string) {
  return `${url}?access_token=${getMapboxToken()}`
}

export function getMapboxToken(): string {
    return 'pk.eyJ1IjoiYXppemJla3BoZCIsImEiOiJjbWc3cDZ5cnowNDdhMmtzaGJpMTNoM3QwIn0.-65ocBfPpeDugTvYQWcTvQ'
}

export function toFourDecimalPlaces(num: number) {
    return parseFloat(num.toFixed(4));
}