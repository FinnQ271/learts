import PageShell from "../components/PageShell";

const content = "<div class=\"page-title-section section\" data-bg-image=\"/assets/images/bg/page-title-1.webp\">\n<div class=\"container\">\n<div class=\"row\">\n<div class=\"col\">\n<div class=\"page-title\">\n<h1 class=\"title\">Lost Password</h1>\n<ul class=\"breadcrumb\">\n<li class=\"breadcrumb-item\"><a href=\"/index\">Home</a></li>\n<li class=\"breadcrumb-item active\">Lost Password</li>\n</ul>\n</div>\n</div>\n</div>\n</div>\n</div><div class=\"section section-padding\">\n<div class=\"container\">\n<div class=\"lost-password\">\n<p>Lost your password? Please enter your username or email address. You will receive a link to create a new password via email.</p>\n<form action=\"#\">\n<div class=\"row learts-mb-n30\">\n<div class=\"col-12 learts-mb-30\">\n<label for=\"userName\">Username or email</label>\n<input id=\"userName\" type=\"text\"/>\n</div>\n<div class=\"col-12 text-center learts-mb-30\">\n<button class=\"btn btn-dark btn-outline-hover-dark\">reset password</button>\n</div>\n</div>\n</form>\n</div>\n</div>\n</div>";

export default function LostPasswordPage() {
  return <PageShell title="Learts \u2013 Handmade Shop eCommerce HTML Template" content={content} />;
}
