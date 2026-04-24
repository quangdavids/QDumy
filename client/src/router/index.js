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
import InstructorProfile from "../pages/instructor/EditInstructorProfile.vue";
import StudentProfilePage from "../pages/students/StudentProfilePage.vue";
import CreateCoursePage from "../pages/instructor/CreateCoursePage.vue";
// import EditCoursePage from "../pages/instructor/EditCoursePage.vue";
import AddLesson from "../pages/instructor/AddLesson.vue";
import StudentDashboard from "../pages/students/StudentDashboardPage.vue";
import StudentAnalytics from "../pages/students/StudentAnalyticsPage.vue";
import HelpSupport from "../pages/other/HelpSupportPage.vue";
import Checkout from "../pages/students/Checkout.vue";
import ContactPage from "../pages/other/ContactPage.vue";
import InstuctorPage from "../pages/instructor/InstructorPage.vue";
import EnrolledStudents from "../pages/instructor/EnrolledStudents.vue";
// import QuizFeedback from "../pages/students/QuizFeedback.vue";
import OverviewPage from "../pages/admin/OverviewPage.vue";
import AdminPage from "../pages/admin/AdminPage.vue";
import LessonListPage from "../pages/instructor/LessonListPage.vue";
import UserDirectory from "../pages/admin/UserDirectory.vue";
import CourseApproval from "../pages/admin/CourseApproval.vue";
import { useAuthStore } from "../stores/auth.store";
const routes = [
  { path: "/", component: HomePage, meta: {showChatbot: true} },
  { path: "/home", component: HomePage, meta: {showChatbot: true} },
  { path: "/login", component: LoginPage, meta: {hideFooter:true}  },
  { path: "/register", component: RegisterPage,  meta: {hideFooter:true} },
  // meta:
  // {
  //   hideNavbar: true,
  //   hideFooter: true,

  // }
  { path: "/aboutUs", component: AboutUsPage, meta: {showChatbot: true} },
  { path: "/course/search", component: SearchCourse, meta: {showChatbot: true} },
  {
    path: "/course/:courseId/lecture",
    name: "CourseLecture",
    component: VideoLearningPage,
    meta: { hideNavbar: true, showChatbot: true },
  },
  // { path: "/course/quiz/feedback",
  //   component: QuizFeedback,
  //   meta: {hideFooter: true}
  // },
  { path: "/instructor/profile/:lecturerId", component: InstructorProfile },
  
  { path: "/cart", component: Cart, meta: {showChatbot: true} },
  { path: "/checkout", component: Checkout,
     meta: { hideFooter: true, showChatbot: true },
   },
   { path: "/payment-success", component: PaymentSuccess,
     meta: { hideNavbar: true, hideFooter: true }
   },
   { path: "/payment-cancel", component: PaymentCancel,
     meta: { hideNavbar: true, hideFooter: true }
   },
   { path: "/contact", component: ContactPage, meta: {showChatbot: true}},
  {
    path: "/support",
    component:  HelpSupport,
    meta: {showChatbot: true}
    
  },

  {
    path: "/admin",
    component: AdminPage,
    meta: {hideNavbar: true, requiresAuth: true, role: 'admin'},
    children: [
      {path: "", component: OverviewPage},
      {path: "overview", component: OverviewPage},
      {path: "user-directory", component: UserDirectory},
      {path: "course-approval", component: CourseApproval}
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
        path: "course/add-lesson/:courseId/",
        component: AddLesson,
        meta: { hideSidebar: true },
      },

      {
        path: "course/view-lessons/:courseId/",
        component: LessonListPage,
      },

      
      {
        path: "course/edit-lesson/:lessonId/",
        component: AddLesson,
       
      },

    ],
  },


  { path: "/:pathMatch(.*)*", component: NotFoundPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const userRole = authStore.user?.role;

 
  if (to.meta.role && to.meta.role !== userRole) {
   
    if (to.meta.role === 'admin' && userRole !== 'admin') {
      return next({ path: '/home' }); 
    }
  }

  next(); 
});


export default router;
