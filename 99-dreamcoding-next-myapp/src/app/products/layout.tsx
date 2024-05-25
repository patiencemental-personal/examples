import Link from 'next/link';

export default function ProductsLayout({
    children
}: {
    children: React.ReactNode
}) {
    return <>
        <div>
            <Link href='/products/women'>여성옷</Link>
            <Link href='/products/man'>남성옷</Link>
        </div>
        {children}
    </>
}