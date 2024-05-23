import { getProduct, getProducts } from '@/service/products';
import Image from 'next/image';
import { notFound, redirect } from 'next/navigation';

export const revalidate = 3;

type Props = {
    params: {
        slug: string;
    }
}

export default async function ProductPage(props: Props) {
    const { params } = props;
    const product = await getProduct(params.slug);
    if (!product) {
        redirect('/products');
        // notFound();
    }
    return <>
        <div>{product.name} 바지 제품 설명 페이지</div>
        <Image
            src={`/images/${product.image}`}
            alt={product.name}
            width='300'
            height='300'
        />
    </>
}

export async function generateStaticParams() {
    const products = await getProducts();
    return products.map(product => ({
        slug: product.id,
    }))
}