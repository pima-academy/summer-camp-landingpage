# pimavn.com

The PiMA Academy website: first moved off its Webflow export onto a code-only build without changing how it looked (the rebuild), restructured for agents (the refactor), then brought in line with PiMA's brand guidelines (brand alignment).

## Language

**Old site**:
The Webflow export in `site/`, as served at pimavn.com before the switch-over. The reference for what the rebuild had to look like; once brand alignment starts, only an archive.
_Avoid_: legacy site, current site, baseline

**Jekyll site**:
PiMA's earlier site at pimavn.github.io, older than the old site: the blog of 2017-2019 and the summer camp pages of 2016-2023. A source for the camp archive pages and the blog's first posts, never served by the rebuild.
_Avoid_: old site (that is the Webflow export), old blog, legacy site

**Rebuild**:
The new code-only version of pimavn.com that replaces the old site, visually equivalent to it.
_Avoid_: new site, redesign, migration (for the result)

**Switch-over**:
The single moment pimavn.com stops serving the old site and starts serving the rebuild, for every page at once. Before it, visitors only ever see the old site.
_Avoid_: launch, go-live, cutover, migration (for the moment)

**Defect fix**:
A change that removes something broken or superfluous from the old site. It may change what a page looks like, but it never changes brand colour, typography or layout.
_Avoid_: improvement, polish

**Brand guidelines**:
PiMA's rules for how the brand looks on the website (naming, logo, colour, typography, shapes, icons, photos), kept in the repo as the single source for every page and component.
_Avoid_: style guide, design system, brand book

**Section**:
A full-width band of a page with one purpose (hero, partners, press, contact form). A page is an ordered list of sections; brand alignment keeps that list, a redesign changes it.
_Avoid_: block, module, row

**Primitive**:
One of the small fixed set of building blocks that carry a brand rule and repeat across sections: `Section`, `Button`, `Kicker`, `BrandName`, `Icon`. A new one needs a pattern repeated in two or more places and a brand rule; every primitive is shown on the catalogue page.
_Avoid_: base component, atom, design-system component

**Widget**:
A reusable component with behaviour or a fixed structure of its own but no brand rule to carry (`Slider`, `Marquee`, `Accordion`, `ContactForm`, `ContentGap`). Lives next to the primitives, is not one.
_Avoid_: primitive (for these), plugin

**Tone**:
One of the four backgrounds a section or a card may have (`white`, `surface`, `pale-lime`, `dark-green`), together with the text colours that pass WCAG AA on it. A section takes it with `Section`'s `tone`, a card with the `data-tone` attribute; neither paints a background of its own.
_Avoid_: theme, background colour, variant

**Kicker**:
The short uppercase line above a heading, under a short PiMA Green rule (a tagline or a breadcrumb such as "PiMA academy > giới thiệu"). Not a heading itself.
_Avoid_: eyebrow, overline, tagline, subheading

**Lightbox**:
A full-screen layer over the page that shows one photo as large as the screen allows, and steps through the other photos of its set: an album of a camp archive page, or a year's covers. It is a widget.
_Avoid_: modal, popup, zoom viewer, gallery viewer

**Camp page**:
Removed (#107). The recruitment page for one edition of the PiMA summer camp (2025, 2026), with its own header and footer instead of the site's. The camp archive page replaced it, and its old URL redirects to that year's camp archive page.
_Avoid_: summer camp page (also names the camp overview page), event page

**Camp archive page**:
The page for one past edition of the PiMA summer camp ("trang chi tiết trại hè"), an academic record of that year (topic, team, entrance exam, lectures, exercises, further reading, group projects, photos) built from one template shared by every year. It carries no recruitment information.
_Avoid_: camp page, camp detail page, event page

**Project topic**:
One problem set for the group projects of a camp year ("đề tài dự án"), with its brief when there is one. Several project groups may work on the same topic, at one campus or at both.
_Avoid_: project (alone), student paper

**Project group**:
The three or four campers who worked on one project topic together, with their mentors, and the report, slides and notebooks they produced. Its report is what the old site called a student paper.
_Avoid_: student paper, team

**Camper**:
A participant of one camp year ("trại sinh"), named with the school or university they gave in that year's sources. Mentors and organizers are not campers, even when the same name appears as a camper in another year.
_Avoid_: student, attendee

**Campus**:
One of the places a camp year was held (Hà Nội, TP.HCM), each with its own dates and venue. A year may have one, two, or be held online.
_Avoid_: site, location, branch

**Refactor**:
The restructuring of the rebuild's code between the rebuild and brand alignment, so that an agent changes one section by reading one file: scoped CSS, one tokens file, section files, a fixed set of primitives. It aims to change nothing visible; small drift is accepted, broken behaviour is not.
_Avoid_: cleanup, rewrite, migration (for this phase)

**Brand alignment**:
A change that brings a page's look in line with the brand guidelines (colour, type weight and size, heading style, corner radius, logo, icons, spacing) while keeping its structure: the same sections in the same order, the same grid, the same content.
_Avoid_: redesign, restyle, polish

**Redesign**:
Any change to a page's structure: adding, removing or reordering sections, changing a layout grid, a new component or a new page. Deferred to a separate effort after brand alignment.
_Avoid_: design tweak, cleanup

**Change log**:
The one GitHub issue, in Vietnamese, that tells PiMA in plain words what the redesign changed on each page compared with before, with screenshots before and after. Written for readers who are not developers.
_Avoid_: release notes, changelog (the file), diff

**Expert**:
A person from outside PiMA who taught, spoke or advised at a PiMA activity ("chuyên gia đồng hành"), named with the title and post they had then. The website names only experts PiMA knows agreed to be shown.
_Avoid_: mentor (mentors are part of the camp team), speaker, advisor

**Talent network**:
PiMA's alumni, mentors and organizers taken together ("mạng lưới nhân tài"), wherever they now study or work. Experts are not part of it. The website speaks of it as a whole (its size, its members' achievements, where they are) and names none of its people.
_Avoid_: community (also covers learners and followers), members, alumni (only one part of it)

**Design defect**:
A flaw in the site's design (not a bug, not missing content) noticed along the way and logged for the redesign rather than fixed.
_Avoid_: design bug, UX issue

**Content gap**:
A component, section or page of the old site that is empty or broken only because its content does not exist yet. The rebuild keeps it, out of visitors' sight, so it can be filled later.
_Avoid_: placeholder, stub, empty section

**Gap page**:
A whole page that is a content gap: a page of the old site with no content yet (course detail, team detail…). It exists only in development, at its old address, and is never built for visitors.
_Avoid_: draft page, hidden page, placeholder page

**Blog**:
The part of pimavn.com that lists blog posts, newest first, and shows each one on a page of its own. It replaced the old site's "Sự kiện & Blog" page; events are not part of it.
_Avoid_: news, events & blog, articles

**Blog post**:
One piece of writing published on the blog ("bài viết"), with a title, a date and optionally an author and a cover photo. Its body may hold mathematical formulas. The posts of 2017-2019 came from the Jekyll site, with their text unchanged. The posts of 2026 came from PiMA's Facebook page: each is one Facebook post, its own text and its photos' captions put in reading order, without the camp promotion and contact details around them.
_Avoid_: article, news item, event, entry

**Catalogue page**:
The development-only page (`/catalogue/`) that shows every primitive in every variant, to see what exists before building a section and to check a primitive change by eye. Never built for visitors.
_Avoid_: style guide, storybook, component library

**Contact form**:
The form on several pages through which a visitor sends PiMA their name, contact details and a message.
_Avoid_: email form, registration form, sign-up form

**Submission**:
One message a visitor sends through the contact form.
_Avoid_: lead, response, entry
