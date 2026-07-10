import PageShell from "../components/PageShell";

const content = "<div class=\"section-404 section\" data-bg-image=\"/assets/images/bg/bg-404.webp\">\n<div class=\"container\">\n<div class=\"content-404\">\n<h1 class=\"title\">Oops!</h1>\n<h2 class=\"sub-title\">Page not found!</h2>\n<p>You could either go back or go to homepage</p>\n<div class=\"buttons\">\n<a class=\"btn btn-primary btn-outline-hover-dark\" href=\"/index\">Go back</a>\n<a class=\"btn btn-dark btn-outline-hover-dark\" href=\"/index\">Homepage</a>\n</div>\n</div>\n</div>\n</div>";

export default function Page404Page() {
  return <PageShell title="Learts \u2013 Handmade Shop eCommerce HTML Template" content={content} />;
}
