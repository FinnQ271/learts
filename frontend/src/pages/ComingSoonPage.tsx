import PageShell from "../components/PageShell";

const content = "<div class=\"coming-soon-section section section-padding\" data-bg-image=\"/assets/images/bg/coming-soon-bg.webp\">\n<div class=\"container\">\n<div class=\"coming-soon-content\">\n<div class=\"logo\">\n<a href=\"/index\"><img alt=\"\" src=\"/assets/images/logo/logo-2.webp\"/></a>\n</div>\n<h2 class=\"title\">Coming soon</h2>\n<div class=\"countdown3\" data-countdown=\"2024/01/01\"></div>\n<div class=\"coming-soon-subscribe\">\n<form class=\"mc-form widget-subscibe\" id=\"mc-form\">\n<input autocomplete=\"off\" class=\"bg-light\" id=\"mc-email\" placeholder=\"Enter your e-mail address\" type=\"email\"/>\n<button class=\"btn btn-dark\" id=\"mc-submit\">subscibe</button>\n</form>\n<!-- mailchimp-alerts Start -->\n<div class=\"mailchimp-alerts text-centre\">\n<div class=\"mailchimp-submitting\"></div><!-- mailchimp-submitting end -->\n<div class=\"mailchimp-success text-success\"></div><!-- mailchimp-success end -->\n<div class=\"mailchimp-error text-danger\"></div><!-- mailchimp-error end -->\n</div><!-- mailchimp-alerts end -->\n</div>\n</div>\n</div>\n</div>";

export default function ComingSoonPage() {
  return <PageShell title="Learts \u2013 Handmade Shop eCommerce HTML Template" content={content} />;
}
