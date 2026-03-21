import { createWebHistory, createRouter } from "vue-router";
import HomePage from "../pages/students/HomePage.vue";
import NotFoundPage from "../pages/other/NotFoundPage.vue";
import LoginPage from "../pages/authentication/LoginPage.vue";
import RegisterPage from "../pages/authentication/RegisterPage.vue";
import AboutUsPage from "../pages/other/AboutUsPage.vue";
import CourseDetails from "../pages/students/CourseDetails.vue";
import Cart from "../pages/students/Cart.vue";
import PaymentSuccess from "../pages/other/PaymentSuccess.vue";
import PaymentCancel from "../pages/other/PaymentCancel.vue";
import StudentCoursePage from "../pages/students/StudentCoursePage.vue";
import SearchCourse from "../pages/students/SearchCoursePage.vue";
import VideoLearningPage from "../pages/students/VideoLearningPage.vue";
import InstuctorDashboard from "../pages/instructor/InstructorDashboard.vue"
import CreateCourse from "../pages/instructor/InstructorCourseList.vue";
import InstructorProfile from "../pages/instructor/InstructorProfile.vue";
import StudentProfilePage from "../pages/students/StudentProfilePage.vue";
import CreateCoursePage from "../pages/instructor/CreateCoursePage.vue";
import AddLesson from "../pages/instructor/AddLesson.vue";
import StudentDashboard from "../pages/students/StudentDashboardPage.vue";
import StudentAnalytics from "../pages/students/StudentAnalyticsPage.vue";
import HelpSupport from "../pages/other/HelpSupportPage.vue";
import Checkout from "../pages/students/Checkout.vue";
import ContactPage from "../pages/other/ContactPage.vue";
import InstuctorPage from "../pages/instructor/InstuctorPage.vue";
import EnrolledStudents from "../pages/instructor/EnrolledStudents.vue";
import QuizFeedback from "../pages/students/QuizFeedback.vue";
import OverviewPage from "../pages/admin/OverviewPage.vue";
import AdminPage from "../pages/admin/AdminPage.vue";
const routes = [
  { path: "/", component: HomePage },
  { path: "/home", component: HomePage },
  { path: "/login", component: LoginPage, meta: { hideNavbar: true, hideFooter: true } },
  { path: "/register", component: RegisterPage },
  // meta:
  // {
  //   hideNavbar: true,
  //   hideFooter: true,

  // }
  { path: "/aboutUs", component: AboutUsPage },
  { path: "/course/search", component: SearchCourse },
  {
    path: "/course/lecture",
    component: VideoLearningPage,
    meta: { hideNavbar: true },
  },
  { path: "/course/quiz/feedback",
    component: QuizFeedback,
    meta: {hideFooter: true}
  },
  { path: "/instructor/profile/:lecturerId", component: InstructorProfile },
  
  { path: "/cart", component: Cart },
  { path: "/checkout", component: Checkout,
     meta: { hideFooter: true },
   },
   { path: "/payment-success", component: PaymentSuccess,
     meta: { hideNavbar: true, hideFooter: true }
   },
   { path: "/payment-cancel", component: PaymentCancel,
     meta: { hideNavbar: true, hideFooter: true }
   },
   { path: "/contact", component: ContactPage},
  {
    path: "/support",
    component:  HelpSupport,

    
  },

  {
    path: "/admin",
    component: AdminPage,
    meta: {hideNavbar: true},
    children: [
      {path: "", component: OverviewPage},
      {path: "overview", component: OverviewPage}
    ]
  },
  { path: "/course/:id", component: CourseDetails, props: true },
  {
    path: "/user",
    component: StudentDashboard,

    children: [
      { path: "", component: StudentAnalytics },
      { path: "dashboard", component: StudentAnalytics },
      { path: "my-courses", component: StudentCoursePage },
      { path: "help", component: HelpSupport },
      { path: "profile", component: StudentProfilePage },
    ],
  },
   

  {
    path: "/instructor",
    component: InstuctorPage,
    meta: { hideNavbar: true },
    children: [
      { path: "course", component: CreateCourse },
      { path: "", component: CreateCourse },
      { path: "dashboard", component: InstuctorDashboard},
      { path: "enrolled-students", component: EnrolledStudents},
      { path: "profile", component: InstructorProfile },


      {
        path: "course/manage/",
        component: CreateCoursePage,
        meta: { hideSidebar: true },
      },

      {
        path: "course/edit/:courseId/",
        component:  CreateCoursePage,
        meta: { hideSidebar: true },
        // children: [
        //   { path: "requirements", component: LearnersAndRequirements },
        // ],
      },

      {
        path: "course/add-lesson/",
        component: AddLesson,
        meta: { hideSidebar: true },
      },
    ],
  },


  { path: "/:pathMatch(.*)*", component: NotFoundPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
