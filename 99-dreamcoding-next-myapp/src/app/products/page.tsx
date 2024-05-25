import Link from 'next/link';
import Image from 'next/image';
import { getProducts } from '@/service/products';
import MeowArticle from '@/components/MeowArticle';
import clothesImage from '../../../public/images/clothes.jpg'; // 서버상의 이미지 사용

export default async function ProductsPage() {
    // throw new Error();
    const products = await getProducts();
    return <>
       <div>제품 소개 페이지~</div>
       <Image src={clothesImage} alt='Clothes' />
       <ul>
        {
            products.map((product, index) => 
                <li key={index}>
                    <Link href={`/products/${product.id}`}>{product.name}</Link>
                </li>
            )
        }
        <MeowArticle />
       </ul>
    </>
}