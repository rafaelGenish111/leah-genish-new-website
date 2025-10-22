import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({
    title = "Leah Genish - רפואה משלימה וטיפול הוליסטי",
    description = "ליאה גניש - מטפלת מוסמכת ברפואה משלימה, רפלקסולוגיה וטיפול הוליסטי. קבעו תור לטיפול מקצועי ואישי.",
    keywords = "רפואה משלימה, רפלקסולוגיה, טיפול הוליסטי, ליאה גניש, מטפלת, בריאות טבעית",
    image = "https://images.unsplash.com/photo-1540555700478-4be289fbecef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    url = window.location.href,
    type = "website",
    schema = null
}) => {
    return (
        <Helmet>
            {/* Basic Meta Tags */}
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            <link rel="canonical" href={url} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={url} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={url} />
            <meta property="twitter:title" content={title} />
            <meta property="twitter:description" content={description} />
            <meta property="twitter:image" content={image} />

            {/* Additional Meta Tags */}
            <meta name="robots" content="index, follow" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
            <meta name="language" content="Hebrew" />
            <meta name="author" content="Leah Genish" />

            {/* Schema.org JSON-LD */}
            {schema && (
                <script type="application/ld+json">
                    {JSON.stringify(schema)}
                </script>
            )}
        </Helmet>
    );
};

export default SEO;
