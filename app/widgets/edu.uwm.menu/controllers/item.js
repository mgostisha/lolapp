var args = arguments[0] || {};

$.item.id = args.id;
$.title.text = args.title;

if(args.image) {
	$.item.add(Ti.UI.createImageView({
		image: args.image,
		width: "21dp",
		height: "21dp",
		top: "13dp",
		left: "13dp",
		touchEnabled: false,
		preventDefaultImage: true
	}));
}