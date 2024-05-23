import os from 'os'
import Counter from '@/components/Counter';
import Image from 'next/image';

export default function Home() {
  console.log('안녕!')
  console.log(os.hostname());
  return <>
    <h1>홈페이지다!!</h1>
    <Counter />
    {/* 외부 이미지 url을 사용할 땐 width, height 지정과 함께 next.config 파일에 설정해줘야 한다 */}
    <Image 
      src='https://images.unsplash.com/photo-1441986300917-64674bd600d8'
      alt='shop'
      width={400}
      height={400}
    />
  </>
}
